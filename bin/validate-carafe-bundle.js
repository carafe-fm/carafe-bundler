#! /usr/bin/env node

const Validator = require('../src/validator.js');
const fs = require('fs');

const inputFilename = process.argv[2] || 'bundle.json';

const validator = new Validator();
validator.validateBundle(JSON.parse(fs.readFileSync(inputFilename, 'utf8')))
    .then(() => {
        console.log('Bundle is valid.');
    })
    .catch(errors => {
        console.error('Bundle is not valid:');
        console.error(errors);
    });
