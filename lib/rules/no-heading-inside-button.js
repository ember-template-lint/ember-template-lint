'use strict';

const NodeMatcher = require('../helpers/node-matcher');
const Rule = require('./_base');

const ERROR_MESSAGE = 'Buttons should not contain heading elements';
const HEADING_ELEMENTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function hasButtonParent(path) {
  let parents = [...path.parents()];
  let refButtonNodes = [
    // <button></button>
    {
      type: 'ElementNode',
      tag: 'button',
    },
    // <div role="button"></div>
    {
      type: 'ElementNode',
      attributes: [
        {
          type: 'AttrNode',
          name: 'role',
          value: {
            type: 'TextNode',
            chars: 'button',
          },
        },
      ],
    },
  ];
  let hasButtonParent = parents.find((parent) => NodeMatcher.match(parent.node, refButtonNodes));
  if (hasButtonParent) {
    return true;
  }
  return false;
}
module.exports = class NoHeadingInsideButton extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        // Only heading elements: check rule conditions
        if (!HEADING_ELEMENTS.has(node.tag)) {
          return;
        }

        // if it's a heading, check to see if one of the parent elements is a button
        if (hasButtonParent(path)) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
