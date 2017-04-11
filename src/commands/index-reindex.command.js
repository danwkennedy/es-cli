const chalk = require('chalk');
const print = require('pretty-print');
const cliff = require('cliff');

module.exports = function configureCommand(commander, config) {
  commander.command('index:reindex [options] <source> <dest>')
    .description('Reindexes the documents from the old index to the new one')
    .option('-w, --wait [false]', `Wait for the request to complete`)
    .option('-s, --size [100]', `The batch size to move documents`)
    .action(getCommandHandler(config));
}

function getCommandHandler(config) {

  const reIndex = async (source, dest, opts) => {
    let client = await config.getClient();

    let params = {
      waitForCompletion: !!opts.wait,
      body: {
        source: {
          index: source,
          size: opts.size
        },
        dest: {
          index: dest
        }
      }
    };

    console.info(`Re-indexing from ${ source } to ${ dest }`);
    let response = await client.reindex(params);

    if (opts.wait) {
      let rows = [
        ['Took', '# Updated', '# Batches', '# Conflicts', '# Failures', '# Created'],
        [response.took, response.updated, response.batches, response.version_conflicts, response.failures.length, response.created]
      ];

      console.info(cliff.stringifyRows(rows, ['green']));

      if (response.failures.length) {
        console.info(chalk.red('Failures'));
        print(response.failures, { leftPadding: 2 });
      }
    } else {
      console.info(response.task);
    }
  };

  return reIndex;
}
