const { createServer } = require('./src/core/server');
const jwtAuth = require('./src/utils/jwtAuth');
const logger = require('./src/core/logger');

module.exports = { createServer, jwt: jwtAuth, logger };
