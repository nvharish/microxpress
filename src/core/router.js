const yaml = require('js-yaml');
const { resolveHandler } = require('./injector');

function initializeRoutes(app, swaggerSpec, handlers, dependencies) {
  const { paths } = yaml.load(swaggerSpec);

  Object.entries(paths).forEach(([route, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      const handlerPath = operation['x-handler'];
      const handler = resolveHandler(handlerPath, handlers, dependencies);
      const middlewares = operation['x-middlewares'] ?? [];

      const routeMiddlewares = [];
      if (middlewares.length > 0) {
        middlewares.forEach((middlewarePath) => {
          const middleware = resolveHandler(
            middlewarePath,
            handlers,
            dependencies
          );
          routeMiddlewares.push(middleware);
        });
      }

      app[method](route, ...routeMiddlewares, async (req, res, next) => {
        try {
          return await handler(req, res, next);
        } catch (err) {
          next(err);
        }
      });
    });
  });
}

module.exports = { initializeRoutes };
