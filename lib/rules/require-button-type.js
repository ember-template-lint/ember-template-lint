'use strict';

const { builders: b } = require('ember-template-recast');

const NodeMatcher = require('../helpers/node-matcher');
const Rule = require('./_base');

const ERROR_MESSAGE = 'All `<button>` elements should have a valid `type` attribute';

function hasFormParent(path) {
  let parents = [...path.parents()];
  let refParentNode = {
    type: 'ElementNode',
    tag: 'form',
  };
  let hasHeadElementInParentPath = parents.some((parent) =>
    NodeMatcher.match(parent.node, refParentNode)
  );
  return Boolean(hasHeadElementInParentPath);
}
module.exports = class RequireButtonType extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
      isFixable: true,
    });
  }

  visitor() {
    return {
      ElementNode(node, path) {
        let { tag, attributes } = node;

        if (tag !== 'button') {
          return;
        }

        let typeAttribute = attributes.find((it) => it.name === 'type');
        if (!typeAttribute) {
          if (this.mode === 'fix') {
            if (hasFormParent(path)) {
              attributes.push(b.attr('type', b.text('submit')));
            } else {
              attributes.push(b.attr('type', b.text('button')));
            }
          } else {
            this.logNode({ node, message: ERROR_MESSAGE });
          }
          return;
        }

        let { value } = typeAttribute;
        if (value.type !== 'TextNode') {
          return;
        }

        let { chars } = value;
        if (!['button', 'submit', 'reset'].includes(chars)) {
          if (this.mode === 'fix') {
            let index = attributes.indexOf(typeAttribute);
            attributes[index] = b.attr('type', b.text('button'));
          } else {
            this.logNode({ node, message: ERROR_MESSAGE });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
