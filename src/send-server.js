const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('faye-websocket');
const BundleConfig = require('../src/bundle-config.js');
const Renderer = require('../src/renderer.js');
const SourceCompiler = require('../src/source-compiler.js');
const slugify = require('slugify');
const minimist = require('minimist');
const chalk = require('chalk');
const open = require('open');

const hotReloadCode = fs.readFileSync(path.join(__dirname, 'hot-reload.html'), 'utf-8');

class SendServer {
    sendToFileMaker(force) {
        let outputFilename = 'tempBundle.bundle';
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

        const sendConfig = JSON.stringify({
            path: path.resolve(outputFilename),
            forceSend: force
        });

        console.debug({
            path: path.resolve(outputFilename),
            forceSend: true
        });

        // url argument takes precedent over config. See src/bundle-config.js for default config value
        let fmpSendUrl = bundleConfig.sendFmpUrl;
        const url = fmpSendUrl.replace(/{sendConfig}/g, encodeURIComponent(sendConfig));

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
}

module.exports = SendServer;
