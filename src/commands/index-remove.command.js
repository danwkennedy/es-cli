const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('index:remove <names...>')
    .description('Drops the passed indices')
    .action(getCommandHandler(config));
}

function getCommandHandler(config) {

  const removeIndices = async (names) => {
    let client = await config.getClient();

    for (let index of names) {
      console.info('Removing index', chalk.red(index));
      await client.indices.delete({ index: index });
    }
  };

  return removeIndices;
}

