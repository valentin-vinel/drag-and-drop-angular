import * as cardsDataMapper from "../dataMappers/cardsDataMapper.js"

export const getAll = async (req, res) => {
  try {
    const cards = await cardsDataMapper.findAll();

    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: "Aucune carte trouvée" });
    }

    return res.json(cards);
  } catch (error) {
    console.error("Erreur dans getAll:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const newData = req.body;

    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ error: "Body vide, rien à mettre à jour" });
    }

    const updatedCard = await cardsDataMapper.update(id, newData);
    res.json(updatedCard);
  } catch (error) {
    console.error("Erreur updateOne:", error);
    res.status(500).json({ error: error.message });
  }
};