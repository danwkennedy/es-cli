const co = require('co');
const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('index:create <alias> <name>')
    .description('Creates a new index')
    .option('-m, --move-alias [false]', `Move the alias to the new index`)
    .action(getCommandHandler(config));
};

function getCommandHandler(config) {
  return function (alias, name, opts) {

    co(function*() {
      let index = config.getIndex(alias);

      if (!index) {
        return console.info(`Could not find alias '${ alias }'`);
      }

      let elasticsearch = yield config.getClient();
      let indexName = getName(name, alias);

      yield elasticsearch.indices.create({
        index: indexName,
        body: {
          mappings: index.mappings,
          settings: index.settings
        }
      });

      if (opts.moveAlias) {
        yield moveAlias(elasticsearch, alias, indexName);
      }
    }).catch( err => { console.error(chalk.red(err.message)) });
  };
}

function getName(name, alias) {
  if (name) {
    return `${ alias }-${ name }`;
  }
  return `${ alias }-${ (new Date()).getTime() }`;
}

function moveAlias(client, alias, newIndex) {
  return client.indices.getAlias({ name: alias })
    .then( body => Object.keys(body)[0])
    .catch(() => '')
    .then( oldIndex => {
      let actions = [
        { add: { alias: alias, index: newIndex }}
      ];

      if (oldIndex) {
        actions.unshift({ remove: { index: oldIndex, alias: alias }});
      }

      return client.indices.updateAliases({
        body: {
          actions: actions
        }
      });
    });
}
