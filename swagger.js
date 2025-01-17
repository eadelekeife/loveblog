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
        url: 'https://loveblog.onrender.com/api/v1'
      },
      {
        url: 'http://localhost:8000/api/v1', // Replace with your base URL
      }
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };