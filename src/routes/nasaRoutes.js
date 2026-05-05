const express = require('express');
const router = express.Router();
const nasaController = require('../controllers/nasaController');

router.get('/apod', nasaController.getApod);
router.get('/weather', nasaController.getWeather);
router.get('/exoplanets', nasaController.getExoplanets);
router.get('/earth', nasaController.getEarth);
router.get('/asteroids', nasaController.getAsteroids);
router.get('/projects', nasaController.getTech);
router.get('/tech', nasaController.getTech); // Alias for compatibility

module.exports = router;
