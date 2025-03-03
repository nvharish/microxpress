const { logger, getLog } = require('./logger');

//eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, _next) {
  const { errors } = err;
  const status = err.status || 500;

  res.on('finish', () => {
    const level = 'error';
    const message = getLog(req, res, err);
    logger.log(level, message);
  });

  return res.status(status).json({
    status,
    message: err.message,
    errors,
  });
};
