const cron = require('node-cron');
const fs = require('fs');
const { parse } = require('json2csv');
const fetchNvidiaStockData = require('./getData'); // Assurez-vous que le chemin d'accès est correct

// Fonction pour récupérer les données et les mettre à jour toutes les 10 secondes
async function updateData() {
    try {
        console.log('Récupération des données boursières de NVIDIA toutes les 10 secondes');
        const data = await fetchNvidiaStockData();

        // Convertir les données en CSV
        const csv = parse(data, { fields: ['date', 'open', 'high', 'low', 'close', 'volume', 'adjClose'] });

        // Écrire les données dans le fichier CSV
        fs.writeFileSync('../public/Data/NVDA}', csv);

        console.log('Mise à jour du fichier CSV terminée');
    } catch (error) {
        console.error('Une erreur est survenue lors de la mise à jour des données :', error);
    }
}

// Planifier l'exécution de la fonction toutes les heures
cron.schedule('0 * * * *', async () => {
    await updateData();
});
