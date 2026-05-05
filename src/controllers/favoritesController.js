const db = require('../db');

exports.getAllFavorites = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM favorites ORDER BY created_at DESC');
        const grouped = result.rows.reduce((acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type].push(item);
            return acc;
        }, { apod: [], weather: [], earth: [], exoplanets: [], asteroids: [], tech: [] });
        res.json({ data: grouped, error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};

exports.saveFavorite = async (req, res) => {
    const { type, item } = req.body;
    try {
        const { title, img, info, id } = item;
        const query = 'INSERT INTO favorites (type, external_id, title, img_url, info) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [type, id?.toString(), title, img || null, info || null];
        const result = await db.query(query, values);
        res.json({ data: result.rows[0], error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};

exports.updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { title, learning_comment } = req.body;
    try {
        let result;
        if (title !== undefined && learning_comment !== undefined) {
            result = await db.query('UPDATE favorites SET title = $1, learning_comment = $2 WHERE id = $3 RETURNING *', [title, learning_comment, id]);
        } else if (title !== undefined) {
            result = await db.query('UPDATE favorites SET title = $1 WHERE id = $2 RETURNING *', [title, id]);
        } else {
            result = await db.query('UPDATE favorites SET learning_comment = $1 WHERE id = $2 RETURNING *', [learning_comment, id]);
        }
        
        if (result.rowCount === 0) return res.status(404).json({ error: 'NotFound', message: 'Item not found' });
        res.json({ data: result.rows[0], error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};

exports.deleteFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM favorites WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'NotFound', message: 'Item not found' });
        res.json({ data: { id }, error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};
