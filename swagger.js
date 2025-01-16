const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Mortgage Documentation',
      version: '1.0.0',
      description: 'API information',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Replace with your base URL
      },
      {
        url: 'https://aimortgagebe.onrender.com/'
      }
    ],
  },
  apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };