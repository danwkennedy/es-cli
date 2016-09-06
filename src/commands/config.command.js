const print = require('pretty-print');
const chalk = require('chalk');
const co = require('co');

module.exports = function configureCommand(commander, config) {
  commander.command('es:config')
      .description('Displays the parsed configuration')
      .action(getCommandHandler(config));
};

function getCommandHandler(config) {
  return function() {

    co(function*() {

      console.log(chalk.green(`\nClient:`));

      let client = yield config.getClient();

      print({
        Hosts: client.transport._config.hosts,
        Version: client.transport._config.apiVersion
      }, { leftPadding: 2 });

      console.log(chalk.green(`\nIndexes (${ config.getIndexes().length }):`));

      for(let index of config.getIndexes()) {
        console.log(`  ${ index.alias }:`);
        print(index, { leftPadding: 4 });
      }

      console.log('');
    }).then(process.exit).catch(err => { console.error(chalk.red(err)) });
  };
}
