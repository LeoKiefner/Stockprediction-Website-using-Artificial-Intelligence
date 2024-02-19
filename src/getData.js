const yahooFinance = require('yahoo-finance');

async function fetchNvidiaStockData() {
    const symbol = 'NVDA';
    const fromDate = '2023-01-01'; // Exemple de date de début
    const toDate = new Date().toISOString().split('T')[0]; // Date du jour

    try {
        const quotes = await yahooFinance.historical({
            symbol: symbol,
            from: fromDate,
            to: toDate,
            // period: 'd',
        });
        console.log(quotes);
        return quotes;
    } catch (error) {
        console.error(error);
    }
}

module.exports = fetchNvidiaStockData;