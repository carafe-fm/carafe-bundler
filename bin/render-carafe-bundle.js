#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk');

const args = minimist(process.argv.slice(2), {
    default: {
        b: false,
        o: false,
        h: false
    },
    alias: {
        b: 'bundlepath',
        o: 'outputpath',
        h: 'help'
    }
});

if (args.help || !args.bundlepath || !args.outputpath) {
    console.log(chalk.yellow('  usage:') + chalk.bold(' render-carafe-bundle -b ') + chalk.blue.bold('<path/to/existing/bundle.json>') + chalk.bold(' -o ') + chalk.blue.bold('<path/to/output/rendered.html>'));
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Renders a validated JSON Bundle to a specified HTML output path.');
    console.log('');
    console.log(chalk.yellow('  options:'));
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Required path to existing valid JSON Bundle');
    console.log('    -o  ' + chalk.blue.bold('<argument>') + ' Required path to output the rendered HTML');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

const inputFilename = args.bundlepath;
const outputFilename = args.outputpath;

const renderer = new Renderer();
const bundle = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
const html = renderer.render(
    bundle.html,
    bundle.bookend,
    bundle.config,
    bundle.data
);

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (! fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
}

fs.writeFileSync(outputFilename, html);
