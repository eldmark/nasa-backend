const express = require('express');
const router = express.Router();
const planetsController = require('../controllers/planetsController');
const { planetValidationRules } = require('../middleware/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomPlanet:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         hostname:
 *           type: string
 *         discovery_method:
 *           type: string
 *         disc_year:
 *           type: integer
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /custom-planets:
 *   get:
 *     summary: Get all custom planets
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of planets
 */
router.get('/', planetsController.getCustomPlanets);

/**
 * @swagger
 * /custom-planets:
 *   post:
 *     summary: Create a custom planet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomPlanet'
 *     responses:
 *       200:
 *         description: Created planet
 */
router.post('/', planetValidationRules, planetsController.createCustomPlanet);

/**
 * @swagger
 * /custom-planets/{id}:
 *   delete:
 *     summary: Delete a custom planet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted planet info
 */
router.delete('/:id', planetsController.deleteCustomPlanet);

module.exports = router;
