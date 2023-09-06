#!/usr/bin/env node

import { Command } from 'commander';

import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.0.1')
  .option('-o, --output [dir]', 'output dir')
  .argument('<url>','URL of page')
  .action((url, options) => {
    pageLoader(url, options.output);
  });

program.parse();
