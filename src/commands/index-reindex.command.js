const co = require('co');
const cliff = require('cliff');

module.exports = function configureCommand(commander, config) {
  commander.command('index:reindex <source> <dest>')
    .description('Reindexes the documents from the old index to the new one')
    .option('-w, --wait [false]', `Wait for the request to complete`)
    .option('-s, --size [100]', `The batch size to move documents`)

    .action(getCommandHandler(config));
}

function getCommandHandler(config) {

  return function reIndex(source, dest, opts) {

    co(function*() {

      let client = yield config.getClient();

      let params = {
        waitForCompletion: opts.wait,
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

      let response = yield client.reindex(params);

      if (opts.wait) {
        let rows = [
          ['Took', '# Updated', '# Batches', '# conflicts', '# failures', '# created'],
          [response.took, response.updated, response.batches, response.version_conflicts, response.failures.length, response.created]
        ];

        console.info(cliff.stringifyRows(rows, ['green']));
      }

      // TODO: handle returning a task
    });

  };
}