
const locator = require('./locator');
const validator = require('./validator');
const Config = require('./config');

module.exports.resolve = function(workingDirectory) {
  let config = locator.getConfiguration(workingDirectory);

  validator.validate(config);

  return new Config(config);
};
