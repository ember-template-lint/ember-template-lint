'use strict';

/*
 Disallows self-closing void elements

 ```
 {{! good }}
 <hr>

 {{! bad}}
 <hr />
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

const buildPlugin = require('./base');
/**
 * [Specs of Void Elements]{@link https://www.w3.org/TR/html-markup/syntax.html#void-element}
 * @type {Object}
 */
const VOID_TAGS = { area: true,
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
                  wbr: true };

module.exports = function(addonContext) {
  let LogSelfClosingVoidElements = buildPlugin(addonContext, 'lint-self-closing-void-elements');

  LogSelfClosingVoidElements.prototype.visitors = function() {
    return {
      ElementNode: function(node) {
        if (VOID_TAGS[node.tag]) {
          let source = this.sourceForNode(node).trim();
          let sourceEndTwoCharacters = source.slice(source.length - 2);

          if (sourceEndTwoCharacters === '/>') {
            let expected = source.slice(0, -2) + '>';

            this.log({
              message: 'Self-closing a void element is redundant',
              line: node.loc.start.line,
              column: node.loc.start.column,
              source: source,
              fix: {
                text: expected
              }
            });
          }
        }
      }
    };
  };

  return LogSelfClosingVoidElements;
};
