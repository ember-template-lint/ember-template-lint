const Rule = require('./base');
const {
  transformTagName,
  isComponentTagName,
  isNestedComponentTagName,
} = require('../helpers/curly-component-invocation');

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
    if (Number.isInteger(name)) {
      return false;
    }
    if (this.isDisallowed(name) || (this.hasComponentTagName(name) && !this.isAllowed(name))) {
      return this.generateError(name);
    }
  }

  hasComponentTagName(name) {
    return isNestedComponentTagName(name) || isComponentTagName(name);
  }

  isDisallowed(name) {
    return this.config.disallow && this.config.disallow.includes(name);
  }

  isAllowed(name) {
    return this.config.allow && this.config.allow.includes(name);
  }

  generateError(name) {
    let angleBracketName = transformTagName(name);
    return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
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
