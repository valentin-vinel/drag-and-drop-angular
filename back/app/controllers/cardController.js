import * as cardsDataMapper from "../dataMappers/cardsDataMapper.js"

export const getAll = async (req, res) => {
    try {
        const cards = await cardsDataMapper.findAll();
    
        res.render("/", { cards });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
};

export const updateOne = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        // Met à jour la carte via le datamapper
        const updatedCard = await cardsDataMapper.update(id, newData);

        // Retourne la carte mise à jour
        res.json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};