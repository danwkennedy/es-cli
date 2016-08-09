const MissingConfigError = require('./errors/missing');
const UnreadableConfigError = require('./errors/unreadable');

const fs = require('fs');

const CONFIG_FILES = [
  '.es-cli',
  '.es-cli.js',
  '.es-cli.json'
];

const FILE_PATTERN = /\.es\-cli(\.json|\.js)?/i;

function getConfiguration(directory) {
  let files = fs.readdirSync(directory).filter(filterFile).sort();

  if(files.length === 0) {
    throw new MissingConfigError(directory);
  }

  let path = `${ directory }/${ files[0] }`;

  try {
    return require(path);
  } catch (e) {
    throw new UnreadableConfigError(path);
  }
}

function filterFile(fileName) {
  return fileName.match(FILE_PATTERN);
}

module.exports = {
  getConfiguration: getConfiguration,
  files: CONFIG_FILES
};
