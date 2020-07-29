'use strict';

const jscodeshift = require('jscodeshift');

function nodeMatchesRef(testNode, refNode) {
  return testNode && refNode && jscodeshift.match(testNode, refNode);
}

function nodeMatchesValidRef(testNode, refNodes) {
  return testNode && refNodes && refNodes.some((refNode) => nodeMatchesRef(testNode, refNode));
}

module.exports = {
  nodeMatchesRef,
  nodeMatchesValidRef,
};
