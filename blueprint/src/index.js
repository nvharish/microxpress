const { createServer, jwt } = require('microexpress');
const path = require('node:path');
const fs = require('node:fs');

const server = createServer({
  swaggerSpec: fs.readFileSync(
    path.join(__dirname, '..', 'swagger', 'api.yaml'),
    'utf-8'
  ),
  handlers: {
    userHandler: require('./handlers/userHandler'),
  },
  middleware: {},
  dependencies: {
    userService: require('./services/userService'),
  },
  serveStaticFiles: true,
  errorHandler: (err, req, res, _next) => {
    res.status(500).json({
      message: 'custom handler',
    });
  },
});

server.listen(process.env.SERVER_PORT, () => {
  //eslint-disable-next-line no-console
  console.info(`Server is running on port ${process.env.SERVER_PORT}`);
});
