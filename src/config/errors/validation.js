const ExtendableError = require('es6-error');

module.exports = class ValidationError extends ExtendableError {
  constructor(errors) {
    super(`There were invalid fields in your configuration`);
    this.errors = errors;
  }
}
