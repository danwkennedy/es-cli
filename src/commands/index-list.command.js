const co = require('co');
const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('index:list [alias]')
    .description('Lists all indices associated with an alias')
    .option('alias', 'The name of the alias to search for. If there is only one configured alias, it will be the default')
    .action(getCommandHandler(config));
}

function getCommandHandler(config) {
  return function(alias) {
    co(function*() {
      let aliases = config.getIndexes().map(index => index.alias);

      if (!alias && aliases.length === 1) {
        alias = aliases[0];
      } else {
        console.log(`Must specify an alias (one of ${ aliases.join('|') })`);
        return;
      }

      if (!aliases.includes(alias)) {
        console.info(`Alias '${ alias }' not in list: ${ aliases.join(', ') }`)
        return;
      }

      let client = yield config.getClient();

      let indices = yield client.indices.get({
        index: `${ alias }*`
      });

      for(let key of Object.keys(indices)) {
        let index = indices[key];

        let hasAlias = Object.keys(index.aliases).includes(alias);

        if (hasAlias) {
          console.log('*', chalk.green(`${ key }`));
        } else {
          console.log(' ', key);
        }
      }

      if(Object.keys(indices).length === 0) {
        console.info('No indices associated with this app');
      }
    });
  }
}
