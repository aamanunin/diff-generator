#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';
import { version } from '../../package.json';
import getDiffOf2JSONFiles from '../lib/diffJSON';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format');

program
  .arguments('<firstConfig> <secondConfig>')
  .action(getDiffOf2JSONFiles);

program.parse(process.argv);

const getDiffOf2Files = (pathToFile1, pathToFile2) => program.action(pathToFile1, pathToFile2);

export default getDiffOf2Files;
