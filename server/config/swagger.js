const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Casino API',
      version: '1.0.0',
      description: 'REST API documentation for Casino Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000/server',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './routes/v1/*.js',
    './routes/v2/*.js',
    './docs/schemas.js'
  ],
};

module.exports = swaggerJsdoc(options);