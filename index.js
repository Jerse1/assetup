#!/usr/bin/env node

// modify require to use esm which allows ES6 imports.
require = require('esm')(module);

// import the cli function from cli.js
require('./src/cli').cli(process.argv);