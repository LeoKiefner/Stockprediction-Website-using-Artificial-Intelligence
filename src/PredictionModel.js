// Simule la récupération des prédictions d'un modèle d'IA
export const fetchPredictions = async (stockSymbol) => {
    // Dans un cas réel, vous feriez ici une requête à une API ou exécuteriez un modèle local.
    // Cette simulation renvoie des données prédictives pour les 7 prochains jours.
    const predictions = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const dateString = futureDate.toISOString().split('T')[0];
        predictions.push({
            date: dateString,
            predictedPrice: Math.random() * 100 + 100, // Génère un prix aléatoire pour l'exemple
        });
    }
    return predictions;
};
