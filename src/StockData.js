import React, { useState, useEffect } from 'react';
import './StockData.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';
import { useParams } from 'react-router-dom'; // Importez useParams

const StockData = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('7 days');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    const { stockSymbol } = useParams(); // Récupérez le symbole du stock de l'URL

    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/Data/${stockSymbol}.csv`, { // Utilisez stockSymbol pour charger le fichier CSV correspondant
            download: true,
            header: true,
            complete: (result) => {
                const now = new Date();
                let startDate;

                if (result.data.length > 0) {
                    const lastEntry = result.data[result.data.length - 1];
                    setCurrentPrice(parseFloat(lastEntry['Close']));
                }

                switch (filter) {
                    case '7 days':
                        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                        break;
                    case '1 month':
                        startDate = new Date(now.setMonth(now.getMonth() - 1));
                        break;
                    case '6 months':
                        startDate = new Date(now.setMonth(now.getMonth() - 6));
                        break;
                    case '1 year':
                        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                        break;
                    default:
                        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                }

                const filteredData = result.data.filter(row => {
                    const rowDate = new Date(row['Date']);
                    return rowDate >= startDate;
                });

                const transformedData = filteredData.map(row => ({
                    date: row['Date'],
                    price: parseFloat(row['Close'])
                }));

                setData(transformedData);

                if (filteredData.length > 0) {
                    const referencePrice = parseFloat(filteredData[0]['Close']);
                    const difference = currentPrice - referencePrice;
                    const percentage = (difference / referencePrice) * 100;
                    setPercentageChange(percentage);
                }
            }
        });
    }, [filter, currentPrice, stockSymbol]);

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
            {data.length > 0 ? (
                <>
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
                </>
            ) : (
                <p>Chargement des données...</p>
            )}
        </div>
    );
};

export default StockData;
