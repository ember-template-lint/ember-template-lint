'use strict';

const jscodeshift = require('jscodeshift');

function nodeMatchesRef(testNode, refNode) {
  return testNode && refNode && jscodeshift.match(testNode, refNode);
}

function nodeMatchesValidRef(testNode, refNodes) {
  return testNode && refNodes && refNodes.some((refNode) => nodeMatchesRef(testNode, refNode));
}

function match(testNode, ref) {
  if (!testNode || !ref) {
    return;
  }
  if (Array.isArray(ref)) {
    return nodeMatchesValidRef(testNode, ref);
  } else {
    return nodeMatchesRef(testNode, ref);
  }
}

module.exports = {
  match,
  nodeMatchesRef,
  nodeMatchesValidRef,
};
