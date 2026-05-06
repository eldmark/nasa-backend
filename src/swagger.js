const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NASA Explorer API',
      version: '1.0.0',
      description: 'A modular proxy API for NASA data and personal favorites.',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
      },
    ],
  },
  apis: ['./src/routes/*.js', './index.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
