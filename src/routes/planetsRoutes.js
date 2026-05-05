const express = require('express');
const router = express.Router();
const planetsController = require('../controllers/planetsController');

router.get('/', planetsController.getCustomPlanets);
router.post('/', planetsController.createCustomPlanet);
router.delete('/:id', planetsController.deleteCustomPlanet);

module.exports = router;
