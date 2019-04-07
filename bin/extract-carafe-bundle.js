#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
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
    console.log(chalk.yellow('  usage:') + chalk.bold(' extract-carafe-bundle -b  ') + chalk.blue.bold('<path/to/existing/bundle.json>'));
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Extracts source files from a given valid JSON Bundle.');
    console.log('           ' + chalk.bgRed(' CAUTION: ') + ' overwrites any existing files without warning.');
    console.log('');
    console.log(chalk.yellow('  configuration:') + ' Source files are loaded from the current directory by default.');
    console.log('                 Source file paths may be customized in your ' + chalk.blue.bold('package.json') + '.');
    console.log(chalk.yellow('  options:'));
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Required path to existing valid JSON Bundle');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

const inputFilename = args.bundlepath;

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

const bundle = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
sourceCompiler.extract(bundle);
