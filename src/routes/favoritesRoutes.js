const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { favoriteValidationRules, updateFavoriteValidationRules } = require('../middleware/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       required:
 *         - type
 *         - item
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         type:
 *           type: string
 *           enum: [apod, weather, earth, exoplanets, asteroids, tech]
 *         external_id:
 *           type: string
 *         title:
 *           type: string
 *         img_url:
 *           type: string
 *         info:
 *           type: string
 *         learning_comment:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all favorites
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order by created_at
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get('/', favoritesController.getAllFavorites);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Save a favorite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               item:
 *                 type: object
 *     responses:
 *       200:
 *         description: Saved favorite
 */
router.post('/', favoriteValidationRules, favoritesController.saveFavorite);

/**
 * @swagger
 * /favorites/{id}:
 *   put:
 *     summary: Update a favorite
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               learning_comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated favorite
 */
router.put('/:id', updateFavoriteValidationRules, favoritesController.updateFavorite);

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Delete a favorite
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted item info
 */
router.delete('/:id', favoritesController.deleteFavorite);

module.exports = router;
