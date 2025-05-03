import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const errorMessage = '<iframe> elements must have a unique title property.';

// iframes have to have titles for "Name,  Role, Value" - https://www.w3.org/TR/UNDERSTANDING-WCAG20/ensure-compat-rsv.html
export default class RequireIframeTitle extends Rule {
  logNode({ message, node }) {
    this.log({
      message,
      node,
    });
  }

  visitor() {
    this.knownTitles = [];
    return {
      ElementNode(node) {
        if (node.tag === 'iframe') {
          const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
          if (ariaHidden) {
            return;
          }
          const hidden = AstNodeInfo.hasAttribute(node, 'hidden');
          if (hidden) {
            return;
          }
          const title = AstNodeInfo.findAttribute(node, 'title');
          if (!title) {
            this.logNode({
              message: errorMessage,
              node,
            });
          } else if (title.value) {
            switch (title.value.type) {
              case 'TextNode': {
                let value = title.value.chars.trim();
                let matchIndex = -1;
                let [, existingNode] = this.knownTitles.find(([val], index) => {
                  if (val === value) {
                    if (matchIndex === -1) {
                      matchIndex = index + 1;
                    }
                    return true;
                  } else {
                    return false;
                  }
                }) || [null, null];
                if (value.length === 0) {
                  this.logNode({
                    message: errorMessage,
                    node,
                  });
                } else if (existingNode) {
                  this.logNode({
                    message: 'This title is not unique.' + ` #${matchIndex}`,
                    node: existingNode,
                  });
                  this.logNode({
                    message:
                      `${errorMessage} ` +
                      `Value title="${title.value.chars}" already used for different iframe.` +
                      ` #${matchIndex}`,
                    node,
                  });
                } else {
                  this.knownTitles.push([value, title]);
                }

                break;
              }
              case 'MustacheStatement': {
                if (title.value.path.type === 'BooleanLiteral') {
                  this.logNode({
                    message: errorMessage,
                    node,
                  });
                }

                break;
              }
              case 'ConcatStatement': {
                if (title.value.parts.length === 1) {
                  if (title.value.parts[0].type === 'MustacheStatement') {
                    if (title.value.parts[0].path.type === 'BooleanLiteral') {
                      this.logNode({
                        message: errorMessage,
                        node,
                      });
                    }
                  }
                }

                break;
              }
              // No default
            }
          } else {
            // ...
          }
        }
      },
    };
  }
}
