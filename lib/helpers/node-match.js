'use strict';

const jscodeshift = require('jscodeshift');

function nodeMatchesRef(testNode, refNode) {
  return jscodeshift.match(testNode, refNode);
}

function nodeMatchesValidRef(testNode, refNodes) {
  return refNodes.some((refNode) => nodeMatchesRef(testNode, refNode));
}

module.exports = {
  nodeMatchesRef,
  nodeMatchesValidRef,
};
