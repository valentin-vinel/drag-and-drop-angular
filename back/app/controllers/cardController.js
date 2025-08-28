import { pgPool } from "../config/pgPool.js";
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

export const reorder = async (req, res) => {
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Body must be an array of {id, position}' });
  }

  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');

    const updatedCards = [];
    for (const u of updates) {
      const result = await client.query(
        'UPDATE cards SET position = $1 WHERE id = $2 RETURNING *',
        [u.position, u.id]
      );
      updatedCards.push(result.rows[0]);
    }

    await client.query('COMMIT');

    res.json(updatedCards);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du reorder' });
  } finally {
    client.release();
  }
}