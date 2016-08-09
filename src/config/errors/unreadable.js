const ExtendableError = require('es6-error');

module.exports = class UnreadableConfigError extends ExtendableError {
  constructor(path) {
    super(`Error reading configuration file: '${ path }'`);
  }
}
