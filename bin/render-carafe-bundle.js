#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const fs = require('fs');
const path = require('path');

const inputFilename = process.argv[2] || 'bundle.json';
const outputFilename = process.argv[3] || 'bundle.html';

const renderer = new Renderer();
const bundle = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
const html = renderer.render(
    bundle.html,
    bundle.bookend,
    bundle.config,
    bundle.data
);

const outputDirectory = path.dirname(path.resolve(outputFilename));

if (! fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, {recursive: true});
}

fs.writeFileSync(outputFilename, html);
