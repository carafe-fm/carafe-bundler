#! /usr/bin/env node

const Renderer = require('../src/renderer.js');
const fs = require('fs');

const inputFilename = process.argv[2];
const outputFilename = process.argv[3];

const renderer = new Renderer();
const bundle = JSON.parse(fs.readFileSync(inputFilename, 'utf8'));
const html = renderer.render(
    bundle.html,
    bundle.bookend,
    bundle.config,
    bundle.data
);

fs.writeFileSync(outputFilename, html);
