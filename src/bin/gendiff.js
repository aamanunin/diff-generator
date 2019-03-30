#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((pathToFile1, pathToFile2, options) => console
    .log(genDiff(pathToFile1, pathToFile2, options.format)));

program.parse(process.argv);
