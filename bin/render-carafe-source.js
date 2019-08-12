#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const DevServer = require('../src/dev-server');
const chokidar = require('chokidar');
const minimist = require('minimist');
const chalk = require('chalk');

const args = minimist(process.argv.slice(2), {
    default: {
        p: 8080,
        s: false,
        u: null,
        f: false,
        h: false,
    },
    alias: {
        p: 'port',
        s: 'send',
        u: 'urlSend',
        f: 'forceSend',
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
    console.log('    -p  ' + chalk.blue.bold('<argument>') + ' Overrides the default localhost port (default is ' + chalk.blue('8080') + ')');
    console.log('    -s  Send the compiled Bundle to Carafe.fmp12 if it is open on the host system (default is ' + chalk.blue('false') + ')');
    console.log('    -u  ' + chalk.blue.bold('<argument>') + ' URL for send (default is ' + chalk.blue('fmp://$/Carafe?script=Send%20Carafe%20Bundle&param={sendConfig}') + ')');
    console.log('        Note: ' + chalk.blue.bold('{sendConfig}') + ' will be expanded into a JSON object with ' + chalk.blue.bold('path') + ' string and ' + chalk.blue.bold('forceSend') + ' bool properties at runtime');
    console.log('    -f  Force the send to overwrite without prompting the user (default is ' + chalk.blue('false') + ')');
    console.log('    -h  Shows this help text');
    console.log('');
    process.exit(1);
}

const port = parseInt(args.port);

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());
const devServer = new DevServer(sourceCompiler, port);

async function send() {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    const sendBinPath = require('path').dirname(require.main.filename);

    let sendCommand = sendBinPath + '/compile-carafe-bundle.js';
    sendCommand = args.forceSend
        ? sendCommand + ' -s -f'
        : sendCommand + ' -s';
    sendCommand = args.urlSend
        ? sendCommand + ' -u ' + args.urlSend
        : sendCommand;

    const { stdout, stderr } = await exec( sendCommand );
    console.log('Send command', sendCommand);
    console.log(stdout);
    if (stderr) {
        console.log(stderr);
    }
}

devServer.start()
    .then(() => {
        console.log(chalk.yellow('Dev server running on localhost:' + port));
        console.log(chalk.yellow('Press ctrl+c to stop'));

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
                send();
            }
        });
    })
    .catch(() => {
        console.error('Unable to start dev server on localhost:' + port);
    });
