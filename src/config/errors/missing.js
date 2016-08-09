const ExtendableError = require('es6-error');

module.exports = class MissingConfigError extends ExtendableError {
  constructor(path) {
    super(`Could not find any configuration files in path: '${ path }'`);
  }
}
