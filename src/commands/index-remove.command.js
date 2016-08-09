const co = require('co');
const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('index:remove <names...>')
    .description('Drops the passed indices')
    .action(getCommandHandler(config));
}

function getCommandHandler(config) {

  return function removeIndices(names) {
    co(function*() {
      let client = yield config.getClient();

      for(let index of names) {
        console.info('Removing index', chalk.red(index));
        yield client.indices.delete({ index: index });
      }
    });
  }
}
