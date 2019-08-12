#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const DevServer = require('../src/dev-server');
const SendServer = require('../src/send-server');
const chokidar = require('chokidar');
const minimist = require('minimist');
const chalk = require('chalk');

const args = minimist(process.argv.slice(2), {
    default: {
        p: 8080,
        h: false,
        f: false,
    },
    alias: {
        p: 'port',
        s: 'send',
        f: 'force',
        h: 'help'
    }
});

if (args.help) {
    console.log(chalk.yellow('  usage:') + chalk.bold(' render-carafe-source [-p ') + chalk.blue.bold('<port>') + chalk.bold(']'));
    console.log('');
    console.log(chalk.yellow('  purpose:') + ' Starts a dev server on ' + chalk.blue('localhost:8080') + ' by default.');
    console.log('           Server hot reloads on changes to source files.');
    console.log('');
    console.log(chalk.yellow('  configuration:') + ' Source files are loaded from the current directory by default.');
    console.log('                 Source file paths may be customized in your ' + chalk.blue.bold('package.json') + '.');
    console.log(chalk.yellow('  options:'));
    console.log('    -p  ' + chalk.blue.bold('<argument>') + ' Overrides the default localhost port (' + chalk.blue('8080') + ')');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

const port = parseInt(args.port);

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());
const devServer = new DevServer(sourceCompiler, port);
const sendServer = new SendServer(sourceCompiler, port);
devServer.start()
    .then(() => {
        console.log(chalk.yellow('Dev server running on localhost:' + port));

        const watcher = chokidar.watch([
            bundleConfig.templateFilename,
            bundleConfig.configFilename,
            bundleConfig.dataFilename,
            bundleConfig.metaFilename
        ].concat(
            Object.values(bundleConfig.watchedFiles)
        ), {
            usePolling: true,
            interval: 1000,
        });

        watcher.on('change', () => {
            devServer.update();

            if (args.send) {
                sendServer.sendToFileMaker(args.force);
            }
        });
    })
    .catch(() => {
        console.error('Unable to start dev server on localhost:' + port);
    });
