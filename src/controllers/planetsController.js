const db = require('../db');

exports.getCustomPlanets = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM custom_planets ORDER BY created_at DESC');
        res.json({ data: result.rows, error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};

exports.createCustomPlanet = async (req, res) => {
    const { name, hostname, discovery_method, disc_year, description } = req.body;
    try {
        const query = 'INSERT INTO custom_planets (name, hostname, discovery_method, disc_year, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [name, hostname, discovery_method, disc_year, description];
        const result = await db.query(query, values);
        res.json({ data: result.rows[0], error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};

exports.deleteCustomPlanet = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM custom_planets WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'NotFound', message: 'Planet not found' });
        res.json({ data: { id }, error: null });
    } catch (err) {
        res.status(500).json({ error: 'DBError', message: err.message });
    }
};
