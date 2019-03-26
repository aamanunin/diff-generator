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
  .option('-f, --format [type]', 'Output format');

program
  .arguments('<firstConfig> <secondConfig>')
  .action((pathToFile1, pathToFile2) => console.log(genDiff(pathToFile1, pathToFile2)));

program.parse(process.argv);
