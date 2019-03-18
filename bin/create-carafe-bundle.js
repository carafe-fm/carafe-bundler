#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

const meta = JSON.parse(fs.readFileSync(bundleConfig.metaFilename, 'utf8'));
const slugifyOptions = {
    replacement: '-',
    remove: /[^\w\s._\-]/g,
    lower: true,
};

let outputFilename = process.argv[2] || 'bundle.json';
outputFilename = outputFilename.replace(/{name}/g, slugify(meta.name, slugifyOptions));
outputFilename = outputFilename.replace(/{version}/g, slugify(meta.version, slugifyOptions));

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (! fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
}

fs.writeFileSync(outputFilename, JSON.stringify(sourceCompiler.compileBundle()));
