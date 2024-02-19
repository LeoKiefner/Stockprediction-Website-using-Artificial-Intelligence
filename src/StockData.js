import React, { useState, useEffect } from 'react';
import './StockData.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useParams } from 'react-router-dom';
import { fetchPredictions } from './PredictionModel';

const StockData = () => {
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [filter, setFilter] = useState('7 days');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const { stockSymbol } = useParams();

    const ALPHA_VANTAGE_API_KEY = '37L20LNUETQ2RVMI';

    // Cette fonction applique le filtre de temps aux données récupérées
    const applyTimeFilter = (allData) => {
        const now = new Date();
        return allData.filter(dataPoint => {
            const dataDate = new Date(dataPoint.date);
            switch (filter) {
                case '7 days':
                    return dataDate >= new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                case '1 month':
                    return dataDate >= new Date(now.setMonth(now.getMonth() - 1));
                case '6 months':
                    return dataDate >= new Date(now.setMonth(now.getMonth() - 6));
                case '1 year':
                    return dataDate >= new Date(now.setFullYear(now.getFullYear() - 1));
                default:
                    return true;
            }
        });
    };

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            const lastFetched = localStorage.getItem(`lastFetched-${stockSymbol}`);
            const today = new Date().toISOString().slice(0, 10);

            if (lastFetched === today) {
                const storedData = localStorage.getItem(`data-${stockSymbol}`);
                setData(JSON.parse(storedData));
            } else {
                const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const response = await fetch(url);
                const result = await response.json();

                if (result['Time Series (Daily)']) {
                    const series = result['Time Series (Daily)'];
                    const processedData = Object.keys(series).map(key => ({
                        date: key,
                        price: parseFloat(series[key]['4. close']),
                    })).sort((a, b) => new Date(a.date) - new Date(b.date));

                    setData(processedData);
                    localStorage.setItem(`data-${stockSymbol}`, JSON.stringify(processedData));
                    localStorage.setItem(`lastFetched-${stockSymbol}`, today);
                }
            }
        };

        fetchDataFromAPI();
    }, [stockSymbol]);

    useEffect(() => {
        const filteredData = applyTimeFilter(data);
        setDisplayData(filteredData);

        if (filteredData.length > 0) {
            const lastDataPoint = filteredData[filteredData.length - 1];
            setCurrentPrice(lastDataPoint.price);
            const firstDataPoint = filteredData[0];
            setPercentageChange(((lastDataPoint.price - firstDataPoint.price) / firstDataPoint.price) * 100);
        }
    }, [filter, data]);

    useEffect(() => {
        const loadPredictions = async () => {
            const predictionData = await fetchPredictions(stockSymbol);
            if (predictionData && predictionData.length > 0) {
                const lastDataPrice = currentPrice;
                const predictionsWithPercentage = predictionData.map(prediction => ({
                    ...prediction,
                    percentageChange: lastDataPrice !== 0 ? ((prediction.predictedPrice - lastDataPrice) / lastDataPrice) * 100 : 0
                }));
                setPredictions(predictionsWithPercentage);
            }
        };

        if (data.length > 0) {
            loadPredictions();
        }
    }, [currentPrice, stockSymbol]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };


    return (
        <div className="stockDataContainer">
            <h2>Valeur boursière de {stockSymbol.toUpperCase()}</h2>
            <div className="filterContainer">
                <label htmlFor="time-filter">Filtrer par période :</label>
                <select id="time-filter" value={filter} onChange={handleFilterChange}>
                    <option value="7 days">7 jours</option>
                    <option value="1 month">1 mois</option>
                    <option value="6 months">6 mois</option>
                    <option value="1 year">1 an</option>
                </select>
            </div>
            <p>Valeur actuelle : ${currentPrice.toFixed(2)}
                <span style={{ color: percentageChange >= 0 ? 'green' : 'red' }}>
                    {` (${percentageChange.toFixed(2)}%)`}
                </span>
            </p>
            <div className="chartContainer">
                <LineChart
                    width={600}
                    height={300}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                        domain={['dataMin', 'dataMax']}
                        width={80}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                            />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
            <div className="chartContainer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h3>Prédictions futures</h3>
                <LineChart
                    width={600}
                    height={300}
                    data={predictions}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                        width={80}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip formatter={(value, name, props) => [`${value.toFixed(2)} (${props.payload.percentageChange.toFixed(2)}%)`, name]} />
                    <Legend />
                    <Line type="monotone" dataKey="predictedPrice" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        </div>
    );
};

export default StockData;

