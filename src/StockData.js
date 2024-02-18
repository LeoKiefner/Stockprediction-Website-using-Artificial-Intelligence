import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockData = () => {
    // Données fictives représentant l'évolution de la valeur boursière sur les 7 derniers jours
    const data = [
        { date: '2024-02-07', price: 250 },
        { date: '2024-02-08', price: 260 },
        { date: '2024-02-09', price: 255 },
        { date: '2024-02-10', price: 265 },
        { date: '2024-02-11', price: 270 },
        { date: '2024-02-12', price: 275 },
        { date: '2024-02-13', price: 280 },
    ];

    return (
        <div>
            <h2>Valeur boursière de NVIDIA</h2>
            {/* Affichez la valeur boursière actuelle, qui est la dernière entrée de votre tableau de données */}
            <p>Valeur actuelle : ${data[data.length - 1].price}</p>
            <LineChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};

export default StockData;
