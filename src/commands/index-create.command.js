const chalk = require('chalk');

module.exports = function configureCommand(commander, config) {
  commander.command('index:create [options] <alias> [name]')
    .description('Creates a new index')
    .option('-m, --move-alias [false]', `Move the alias to the new index`)
    .option(`--shards [1]`, `The number of shards available to the index`)
    .option(`--replicas [1]`, `The number of replicas on the index`)
    .action(getCommandHandler(config));
};

function getCommandHandler(config) {
  return async (alias, name, opts) => {

    let index = config.getIndex(alias);

    if (!index) {
      return console.info(chalk.red(`Could not find alias '${ alias }'`));
    }

    let elasticsearch = await config.getClient();
    let indexName = getName(name, alias);

    await elasticsearch.indices.create({
      index: indexName,
      body: {
        mappings: index.mappings,
        settings: index.settings
      }
    });

    if (opts.moveAlias) {
      await moveAlias(elasticsearch, alias, indexName);
    }

    console.info(indexName);
  };
}

function getName(name, alias) {
  if (name) {
    return `${ alias }-${ name }`;
  }
  return `${ alias }-${ (new Date()).getTime() }`;
}

async function moveAlias(client, alias, newIndex) {
  const oldIndex = client.indices.getAlias({ name: alias }).then(body => Object.keys(body)[0]).catch(() => '');

  let actions = [
    { add: { alias: alias, index: newIndex } }
  ];

  if (oldIndex) {
    actions.unshift({ remove: { index: oldIndex, alias: alias } });
  }

  return client.indices.updateAliases({
    body: {
      actions: actions
    }
  });
}
