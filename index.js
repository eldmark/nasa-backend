require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
const nasaRoutes = require('./src/routes/nasaRoutes');
const favoritesRoutes = require('./src/routes/favoritesRoutes');
const planetsRoutes = require('./src/routes/planetsRoutes');

app.use('/api', nasaRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/custom-planets', planetsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'NASA Explorer API - Modular Version' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
