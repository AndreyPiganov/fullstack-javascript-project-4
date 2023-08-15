#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command()

program
.name('page-loader')
.description('Page loader utility')
.version('0.0.1')
.option('-o, --output [dir]' ,'output dir', '/home/user/current-dir')
.argument('filepath')
.action((filepath) =>{
    const option = program.opts();
    console.log(option);
})

program.parse();
