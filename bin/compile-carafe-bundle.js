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
        b: 'dist/{name}-{version}-{creator}.carafe-draft-02.json',
        s: false,
        u: null,
        f: false,
        h: false
    },
    alias: {
        b: 'bundlePath',
        s: 'send',
        u: 'urlSend',
        f: 'forceSend',
        h: 'help'
    }
});

if (args.help) {
    console.log(chalk.yellow('  usage:')
        + chalk.bold(' compile-carafe-bundle')
        + chalk.bold(' [-b ') + chalk.blue.bold('<output/path/to/new/bundle.json>') + chalk.bold(']')
        + chalk.bold(' [-p ')
        + chalk.bold(' [-f]')
        + chalk.bold(' [-u ') + chalk.blue.bold('<fmpurl>') + chalk.bold(']]')
    );
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Compiles source files to a validated JSON Bundle.');
    console.log('           Optionally sends Bundle to ' + chalk.blue.bold('Carafe.fmp12') + ' if it is open on the host system.');
    console.log('');
    console.log(chalk.yellow('  configuration:') + ' Source files are loaded from the current directory by default.');
    console.log('                 Source file paths and send URL may be customized in your ' + chalk.blue.bold('package.json') + '.');
    console.log(chalk.yellow('  options:'));
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Bundle path (default is ' + chalk.blue('dist/{name}-{version}-{creator}.carafe-draft-02.json') + ')');
    console.log('    -s  Send the compiled Bundle to Carafe.fmp12 if it is open on the host system (default is ' + chalk.blue('false') + ')');
    console.log('    -u  ' + chalk.blue.bold('<argument>') + ' URL for send (default is ' + chalk.blue('fmp://$/Carafe?script=Send%20Carafe%20Bundle&param={sendConfig}') + ')');
    console.log('        Note: ' + chalk.blue.bold('{sendConfig}') + ' will be expanded into a JSON object with ' + chalk.blue.bold('path') + ' string and ' + chalk.blue.bold('forceSend') + ' bool properties at runtime');
    console.log('    -f  Force the send to overwrite without prompting the user (default is ' + chalk.blue('false') + ')');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

let outputFilename = args.bundlePath;

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

const meta = JSON.parse(fs.readFileSync(bundleConfig.metaFilename, 'utf8'));
const slugifyOptions = {
    replacement: '-',
    remove: /[^\w\s_\-]/g,
    lower: false,
};
slugify.extend({ '.': '-' });

outputFilename = outputFilename.replace(/{name}/g, slugify(meta.name, slugifyOptions)).toLowerCase();
outputFilename = outputFilename.replace(/{version}/g, slugify(meta.version, slugifyOptions)).toLowerCase();
outputFilename = outputFilename.replace(/{creator}/g, slugify(meta.creator, slugifyOptions)).toLowerCase();

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const bundle = JSON.stringify(sourceCompiler.compileBundle());
fs.writeFileSync(outputFilename, bundle);

console.log('Bundle output to ' + path.resolve(outputFilename));

const sendConfig = JSON.stringify({
    path: path.resolve(outputFilename),
    forceSend: args.forceSend
});

// url argument takes precedent over config. See src/bundle-config.js for default config value
let fmpSendUrl = args.urlSend ? args.urlSend : bundleConfig.sendFmpUrl;
const url = fmpSendUrl.replace(/{sendConfig}/g, encodeURIComponent(sendConfig));

if (args.send) {
    console.log('Opening ' + url);
    (async () => {
        try {
            await open(url);
        } catch (err) {
            console.log(chalk.bgRed.bold('   Error!   '));
            if (err.code === 'E2BIG') {
                console.log('This URL is too big.');
            } else {
                console.log('An unexpected error occurred. Here is the error dump. Sorry it didn\'t work out.');
                console.log(err);
            }
        }
    })();
}
