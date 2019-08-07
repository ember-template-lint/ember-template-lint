'use strict';

const compilerPath = require.resolve('@glimmer/compiler');

// eslint-disable-next-line node/no-extraneous-require
const syntaxPath = require.resolve('@glimmer/syntax', { paths: [compilerPath] });

module.exports = require(syntaxPath).preprocess;
