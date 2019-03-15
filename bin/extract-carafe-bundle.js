#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const BundleConfig = require('../src/bundle-config.js');
const SourceCompiler = require('../src/source-compiler.js');
const fs = require('fs');

const inputFilename = process.argv[2] || 'bundle.json';

const bundleConfig = new BundleConfig(process.cwd());
const sourceCompiler = new SourceCompiler(bundleConfig, new Renderer());

const bundle = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
sourceCompiler.extract(bundle);
