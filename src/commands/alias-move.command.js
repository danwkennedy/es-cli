const co = require('co');
const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('alias:move <alias> <index>')
    .description('Move the given alias to another index')
    .action(getCommandHandler(config));
};

function getCommandHandler(config) {

  return function moveAlias(alias, index) {

    let aliases = config.getIndexes().map(index => index.alias);

    if (!aliases.includes(alias)) {
      console.info(chalk.red(`Alias '${ alias }' not in list: ${ aliases.join(', ') }`))
      return;
    }

    co(function*() {
      let client = yield config.getClient();

      let oldIndex = yield client.indices.getAlias({ name: alias })
        .then( body => Object.keys(body)[0])
        .catch(() => '');

      let actions = [
          { add: { alias: alias, index: index }}
      ];

      if (oldIndex) {
        console.info(`Removing alias ${ alias } from`, chalk.red(oldIndex));
        actions.unshift({ remove: { index: oldIndex, alias: alias }});
      }

      console.info(`Adding alias ${ alias } to`, chalk.green(index));
      yield client.indices.updateAliases({
        body: {
          actions: actions
        }
      });

    });
  };

}
