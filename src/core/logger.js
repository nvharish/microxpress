const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(
  ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
);

const logger = createLogger({
  format: combine(
    colorize({ level: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    logFormat
  ),
  transports: [new transports.Console()],
});

function getLog(req, res, err = null) {
  const log = [
    req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    `method: ${req.method}`,
    `url: ${req.url}`,
    `query params: ${JSON.stringify(req.query || {})}`,
    `host: ${req.headers.host}`,
    `content-type: ${req.headers['content-type'] || ''}`,
    `accept: ${req.headers.accept}`,
    `content-length: ${req.headers['content-length'] || 0}`,
    `statusCode: ${res.statusCode}`,
    `statusMessage: ${res.statusMessage}`,
    `referer: ${req.headers.referer || ''}`,
    `user-agent: ${req.headers['user-agent']}`,
    `x-trace-id: ${req.headers['x-trace-id'] || ''}`,
  ];

  if (err) {
    log.push(`error: ${err.message}`);
  }

  if (process.env.NODE_ENV !== 'production') {
    log.push(`request body: ${JSON.stringify(req.body || {})}`);
    if (err) {
      log.push(`stack: ${err.stack}`);
    }
  }

  return log.join(' - ');
}

module.exports = { logger, getLog };
