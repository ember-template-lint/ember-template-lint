'use strict';

let compilerPath = require.resolve('@glimmer/compiler');
let syntaxPath = require.resolve('@glimmer/syntax', { paths: [compilerPath] });
module.exports = require(syntaxPath).preprocess;
