const express = require('express');
const { logger, getLog } = require('./logger');
const { initializeRoutes } = require('./router');
const defaultErrorHandler = require('./errorHandler');

/**
 * @typedef {Object} ServerConfig
 * @property {Buffer} swaggerSpec - The Swagger/OpenAPI specification object.
 * @property {}
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions.
 * @property {Object} [dependencies] - Optional dependencies to inject into handlers.
 * @property {string} [jwtSecret] - The JWT secret for authentication.
 * @property {Object} [jwtOptions] - Additional options for JWT verification.
 */

/**
 *
 * @param {*} param0
 * @returns {import('express').Express}
 */
function createServer({
  swaggerSpec,
  handlers,
  middlewares = null,
  dependencies = null,
  serveStaticFiles = false,
  errorHandler = defaultErrorHandler,
}) {
  process.loadEnvFile();
  const app = express();
  app.use(express.json());

  if (serveStaticFiles) {
    app.use(express.static('public'));
  }

  //logger
  app.use((req, res, next) => {
    const startTime = process.hrtime(); // High-resolution time at the start of the request
    res.on('finish', () => {
      const diff = process.hrtime(startTime); // Get the high-resolution difference
      const log = getLog(req, res);
      const responseTimeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2); // Convert to milliseconds
      logger.info(`${log} - response time: ${responseTimeInMs} ms`);
    });

    next();
  });

  if (middlewares) {
    middlewares.forEach((middleware) => app.use(middleware));
  }

  initializeRoutes(app, swaggerSpec, handlers, dependencies);

  //error handler
  app.use(errorHandler);

  return app;
}

module.exports = { createServer };
