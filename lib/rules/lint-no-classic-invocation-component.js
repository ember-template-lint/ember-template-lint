const Rule = require('./base');
const {
  transformTagName,
  isComponentTagName,
  isNestedComponentTagName,
} = require('../helpers/classic-invocation-component');

module.exports = class NoComponentClassicInvocation extends Rule {
  logNode({ message, node }) {
    this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  detectClassicInvocationSyntax(node) {
    let name = node.path.original;
    if (
      !Number.isInteger(name) &&
      (isNestedComponentTagName(name) || isComponentTagName(name)) &&
      (this.config.allow && !this.config.allow.includes(name))
    ) {
      return this.generateError(name);
    }
  }

  generateError(name) {
    let angleBracketName = transformTagName(name);
    return `You are using the component {{${name}}} with classic invocation syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-classic-invocation-component' rule configuration, e.g. \`'no-classic-invocation-component': { allow: ['${name}'] }\`.`;
  }

  visitor() {
    return {
      MustacheStatement(node) {
        let message = this.detectClassicInvocationSyntax(node);
        if (message) {
          this.logNode({ message, node });
        }
      },

      BlockStatement(node) {
        let message = this.detectClassicInvocationSyntax(node);
        if (message) {
          this.logNode({ message, node });
        }
      },
    };
  }
};
