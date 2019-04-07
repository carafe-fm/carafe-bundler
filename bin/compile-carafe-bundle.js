#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk');
const open = require('open');

const args = minimist(process.argv.slice(2), {
    default: {
        b: 'dist/Carafe_{name}_v{version}.json',
        f: false,
        h: false
    },
    alias: {
        b: 'bundlepath',
        f: 'filemaker',
        h: 'help'
    }
});

if (args.help) {
    console.log(chalk.yellow('  usage:') + chalk.bold(' compile-carafe-bundle [-f] [-b ') + chalk.blue.bold('<output/path/to/new/bundle.json>') + chalk.bold(']'));
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Compiles source files to a validated JSON Bundle.');
    console.log('           Optionally sends Bundle to ' + chalk.blue.bold('Carafe.fmp12') + ' if it is open on the host system.');
    console.log('');
    console.log(chalk.yellow('  configuration:') + ' Source files are loaded from the current directory by default.');
    console.log('                 Source file paths may be customized in your ' + chalk.blue.bold('package.json') + '.');
    console.log(chalk.yellow('  options:'));
    console.log('    -f  Sends the compiled Bundle to Carafe.fmp12 if it is open on the host system');
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Overrides the default Bundle output path (' + chalk.blue('dist/Carafe-Bundle-{name}-{version}.json') + ')');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

let outputFilename = args.bundlepath;

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

const meta = JSON.parse(fs.readFileSync(bundleConfig.metaFilename, 'utf8'));
const slugifyOptions = {
    replacement: '-',
    remove: /[^\w\s_\-]/g,
    lower: false,
};
slugify.extend({'.': '-'});

outputFilename = outputFilename.replace(/{name}/g, slugify(meta.name, slugifyOptions));
outputFilename = outputFilename.replace(/{version}/g, slugify(meta.version, slugifyOptions));

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
}

const bundle = JSON.stringify(sourceCompiler.compileBundle());
fs.writeFileSync(outputFilename, bundle);

if (args.filemaker) {
    (async () => {
        await open('fmp://$/Carafe?script=Import%20Carafe%20Bundle&param=' + encodeURIComponent(bundle));
    })();
}

