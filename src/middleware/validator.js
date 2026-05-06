const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid input data',
        details: errors.array()
    });
};

exports.favoriteValidationRules = [
    body('type').isIn(['apod', 'weather', 'earth', 'exoplanets', 'asteroids', 'tech']),
    body('item.title').notEmpty().withMessage('Title is required'),
    validate
];

exports.planetValidationRules = [
    body('name').notEmpty().withMessage('Planet name is required'),
    body('disc_year').optional().isInt({ min: 1600, max: 2100 }),
    validate
];

exports.updateFavoriteValidationRules = [
    body('title').optional().notEmpty(),
    body('learning_comment').optional().isString(),
    validate
];
