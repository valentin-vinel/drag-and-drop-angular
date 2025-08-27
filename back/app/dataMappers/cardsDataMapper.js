import { pgPool } from "../config/pgPool.js";

export const findAll = async () => {
    try {
        const { rows: cards } = await pgPool.query("SELECT * FROM cards");
        return cards;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des cards")
    }
};

export const update = async (id, newData) => {
    try {
        const fields = [];
        const values = [];
        let i = 1;
    
        for (const key in newData) {
          fields.push(`${key} = $${i}`);
          values.push(newData[key]);
          i++;
        }
        
        values.push(id); // dernier paramètre pour WHERE id = $n

        const query = `
        UPDATE cards
        SET ${fields.join(', ')}
        WHERE id = $${i}
        RETURNING *;
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("Erreur lors de la mise à jour de la card")
    }
}