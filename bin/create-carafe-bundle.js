#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const fs = require('fs');
const path = require('path');

const outputFilename = process.argv[2] || 'bundle.json';

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

if (! fs.existsSync(outputDirectory)) {
    fs.mkdirSync(path.dirname(path.resolve(outputFilename)), {recursive: true});
}

fs.writeFileSync(outputFilename, JSON.stringify(sourceCompiler.compileBundle()));
