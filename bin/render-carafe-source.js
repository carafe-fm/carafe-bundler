#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const DevServer = require('../src/dev-server');
const chokidar = require('chokidar');

const port = parseInt(process.argv[2] || 8080);

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());
const devServer = new DevServer(sourceCompiler, port);
devServer.start()
    .then(() => {
        console.log('Dev server running on localhost:' + port);

        const watcher = chokidar.watch([
            bundleConfig.templateFilename,
            bundleConfig.configFilename,
            bundleConfig.dataFilename,
            bundleConfig.metaFilename
        ], {
            usePolling: true,
            interval: 1000,
        });

        watcher.on('change', () => {
            devServer.update();
        });
    })
    .catch(() => {
        console.error('Unable to start dev server on localhost:' + port);
    });
