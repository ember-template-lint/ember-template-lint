import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

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
  let hasButtonParent = parents.find((parent) => match(parent.node, refButtonNodes));
  if (hasButtonParent) {
    return true;
  }
  return false;
}
export default class NoHeadingInsideButton extends Rule {
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
}
