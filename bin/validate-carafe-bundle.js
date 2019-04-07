#! /usr/bin/env node

const Validator = require('../src/validator.js');
const fs = require('fs');
const minimist = require('minimist');
const chalk = require('chalk');

const args = minimist(process.argv.slice(2), {
    default: {
        b: false,
        h: false
    },
    alias: {
        b: 'bundlepath',
        h: 'help'
    }
});

if (args.help || !args.bundlepath) {
    console.log(chalk.yellow('  usage:') + chalk.bold(' validate-carafe-bundle -b ') + chalk.blue.bold('<path/to/existing/bundle.json>'));
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Validates a JSON Bundle.');
    console.log('');
    console.log(chalk.yellow('  options:'));
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Required path to existing valid JSON Bundle');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

const inputFilename = args.bundlepath;

const validator = new Validator();
validator.validateBundle(JSON.parse(fs.readFileSync(inputFilename, 'utf8')))
    .then(() => {
        console.log('Bundle is valid.');
    })
    .catch(errors => {
        console.error('Bundle is not valid:');
        console.error(errors);
    });
