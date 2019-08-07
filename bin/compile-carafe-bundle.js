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
        u: null,
        p: false,
        f: false,
        h: false
    },
    alias: {
        b: 'bundlePath',
        u: 'urlPush',
        p: 'push',
        f: 'forcePush',
        h: 'help'
    }
});

if (args.help) {
    console.log(chalk.yellow('  usage:')
        + chalk.bold(' compile-carafe-bundle')
        + chalk.bold(' [-b ') + chalk.blue.bold('<output/path/to/new/bundle.json>') + chalk.bold( ']')
        + chalk.bold(' [-p ')
        + chalk.bold(' [-f]')
        + chalk.bold(' [-u ') + chalk.blue.bold('<fmpurl>') + chalk.bold(']]')
    );
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Compiles source files to a validated JSON Bundle.');
    console.log('           Optionally sends Bundle to ' + chalk.blue.bold('Carafe.fmp12') + ' if it is open on the host system.');
    console.log('');
    console.log(chalk.yellow('  configuration:') + ' Source files are loaded from the current directory by default.');
    console.log('                 Source file paths and push URL may be customized in your ' + chalk.blue.bold('package.json') + '.');
    console.log(chalk.yellow('  options:'));
    console.log('    -b  ' + chalk.blue.bold('<argument>') + ' Bundle path (' + chalk.blue('dist/Carafe-Bundle-{name}-{version}.json') + ')');
    console.log('    -p  Push the compiled Bundle to Carafe.fmp12 if it is open on the host system (default is ' + chalk.blue('false') + ')');
    console.log('    -f  Force the push to overwrite without prompting the user (default is ' + chalk.blue('false') + ')');
    console.log('    -u  ' + chalk.blue.bold('<argument>') + ' URL for push (' + chalk.blue('fmp://$/Carafe?script=Push%20Carafe%20Bundle&param={pushConfig}') + ')');
    console.log('        Note: ' + chalk.blue.bold('{pushConfig}') + ' will be expanded into a JSON object with ' + chalk.blue.bold('path') + ' string and ' + chalk.blue.bold('forcePush') + ' bool properties at runtime');
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
slugify.extend({'.': '-'});

outputFilename = outputFilename.replace(/{name}/g, slugify(meta.name, slugifyOptions));
outputFilename = outputFilename.replace(/{version}/g, slugify(meta.version, slugifyOptions));

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
}

const bundle = JSON.stringify(sourceCompiler.compileBundle());
fs.writeFileSync(outputFilename, bundle);

console.log('Bundle output to ' + path.resolve(outputFilename));

const pushConfig = JSON.stringify({
    path: path.resolve(outputFilename),
    forcePush: args.forcePush
});

// url argument takes precedent over config. See src/bundle-config.js for default config value
let fmpPushUrl = args.urlPush ? args.urlPush : bundleConfig.pushFmpUrl;
const url = fmpPushUrl.replace(/{pushConfig}/g, encodeURIComponent(pushConfig));

if (args.push) {
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
