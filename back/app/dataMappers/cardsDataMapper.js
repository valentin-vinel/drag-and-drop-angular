import { pgPool } from "../config/pgPool.js";

export const findAll = async () => {
  try {
    const result = await pgPool.query(`
      SELECT id, name, position
      FROM cards
      ORDER BY position ASC;
    `);

    return result.rows;
  } catch (error) {
    console.error("❌ Erreur PostgreSQL dans findAll:", error); // <-- affiche l'erreur réelle
    throw new Error("Erreur lors de la récupération des cards");
  }
};

export const update = async (id, newData) => {
  try {
    if (!id) throw new Error("id manquant");
    if (!newData || Object.keys(newData).length === 0) {
      throw new Error("newData vide, rien à mettre à jour");
    }

    const fields = [];
    const values = [];
    let i = 1;

    for (const key in newData) {
      fields.push(`${key} = $${i}`);
      values.push(newData[key]);
      i++;
    }

    values.push(id);

    const query = `
      UPDATE cards
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING id, name, position;
    `;

    const result = await pgPool.query(query, values);

    if (!result.rows[0]) {
      throw new Error(`Aucune card trouvée avec id ${id}`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("❌ Erreur PostgreSQL update:", error); // <-- log complet
    throw error; // laisse passer l’erreur originale pour debug
  }
}