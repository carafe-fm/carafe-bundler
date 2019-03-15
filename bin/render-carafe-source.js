#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const DevServer = require('../src/dev-server');
const chokidar = require('chokidar');

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());
const devServer = new DevServer(sourceCompiler, 8080);
devServer.start();
console.log('Dev server running on localhost:8080');

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
