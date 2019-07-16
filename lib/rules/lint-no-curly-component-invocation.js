const Rule = require('./base');
const { transformTagName } = require('../helpers/curly-component-invocation');
const IN_BUILT_HELPERS = [
  'action',
  'array',
  'component',
  'concat',
  'debugger',
  'each',
  'each-in',
  'fn',
  'get',
  'hasBlock',
  'hasBlockParams',
  'hash',
  'if',
  'input',
  'let',
  'link-to',
  'loc',
  'log',
  'mount',
  'mut',
  'on',
  'outlet',
  'partial',
  'query-params',
  'textarea',
  'unbound',
  'unless',
  'with',
  'yield',
];

module.exports = class NoCurlyComponentInvocation extends Rule {
  logNode({ message, node }) {
    this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  detectCurlyInvocationSyntax(node) {
    let name = node.path.original;
    if (Number.isInteger(name)) {
      return '';
    }
    if (node.type === 'BlockStatement' && !IN_BUILT_HELPERS.includes(name)) {
      return this.generateError(name);
    }
    if (name.startsWith('this.') || name.startsWith('@')) {
      return '';
    }
    if (this.isDisallowed(name) || !this.isAllowed(name)) {
      return this.generateError(name);
    }
  }

  isDisallowed(name) {
    return this.config.disallow && this.config.disallow.includes(name);
  }

  isAllowed(name) {
    return (
      IN_BUILT_HELPERS.includes(name) || (this.config.allow && this.config.allow.includes(name))
    );
  }

  generateError(name) {
    let angleBracketName = transformTagName(name);
    return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
  }

  visitor() {
    return {
      MustacheStatement(node) {
        let message = this.detectCurlyInvocationSyntax(node);
        if (message) {
          this.logNode({ message, node });
        }
      },

      BlockStatement(node) {
        let message = this.detectCurlyInvocationSyntax(node);
        if (message) {
          this.logNode({ message, node });
        }
      },
    };
  }
};
