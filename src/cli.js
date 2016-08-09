#!/usr/bin/env node
const commander = require('commander');
const commands = require('./commands');
const configurator = require('./config');

const chalk = require('chalk');

process.on('uncaughtException', err => {
  console.log(chalk.red('Uncaught Exception:'));

  console.log(err);
  process.exit(1);
});

const config = configurator.resolve(process.cwd());

for (let command of commands) {
  command(commander, config);
}

commander.parse(process.argv);
