import { builders } from 'ember-template-recast';

import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

/*
 Disallows self-closing void elements

 ```
 {{!-- good  --}}
 <hr>

 {{!-- bad --}}
 <hr />
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

/**
 * [Specs of Void Elements]{@link https://www.w3.org/TR/html-markup/syntax.html#void-element}
 * @type {Object}
 */
const VOID_TAGS = {
  area: true,
  base: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};

export default class SelfClosingVoidElements extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config;
      }
      case 'string': {
        if (config === 'require') {
          return config;
        }
        break;
      }
      case 'undefined': {
        return true;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable and `false` to disable',
        '  * "require" - checks for closing tags in void elements',
      ],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    return {
      ElementNode(node) {
        if (VOID_TAGS[node.tag]) {
          let source = this.sourceForNode(node).trim();
          let sourceEndTwoCharacters = source.slice(-2);
          let isSelfClosingRequired = this.config === 'require';
          let shouldLogError = isSelfClosingRequired
            ? sourceEndTwoCharacters !== '/>'
            : sourceEndTwoCharacters === '/>';

          if (shouldLogError) {
            let expected = isSelfClosingRequired
              ? `${source.slice(0, -1)}/>`
              : `${source.slice(0, -2)}>`;

            if (this.mode === 'fix') {
              let editedNode = builders.element(node.tag, {
                attrs: node.attributes,
                modifiers: node.modifiers,
                children: node.children,
                comments: node.comments,
                blockParams: node.blockParams,
                loc: node.loc,
              });
              editedNode.selfClosing = isSelfClosingRequired;
              return editedNode;
            } else {
              this.log({
                message: isSelfClosingRequired
                  ? 'Self-closing a void element is required'
                  : 'Self-closing a void element is redundant',
                node,
                source,
                fix: {
                  text: expected,
                },
                isFixable: true,
              });
            }
          }
        }
      },
    };
  }
}
