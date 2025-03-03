function resolveHandler(handlerPath, handlers, dependencies) {
  const [moduleName, functionName] = handlerPath.split('.');
  const module = handlers[moduleName];

  return module[functionName].bind(null, dependencies);
}

module.exports = { resolveHandler };
