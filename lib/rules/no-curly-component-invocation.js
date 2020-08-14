const createErrorMessage = require('../helpers/create-error-message');
const { transformTagName } = require('../helpers/curly-component-invocation');
const Rule = require('./base');

const DEFAULT_CONFIG = {
  allow: [],
  disallow: [],
  requireDash: true,
  noImplicitThis: false,
};

const BUILT_INS = new Set([
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
  'has-block',
  'has-block-params',
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
  '-in-element',
  'in-element',
  /* from ember-cli-app-version */
  'app-version',
]);

const ALWAYS_CURLY = new Set(['yield']);

module.exports = class NoCurlyComponentInvocation extends Rule {
  parseConfig(config) {
    return parseConfig(config);
  }

  logNode({ message, node }) {
    this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  generateError(name) {
    let angleBracketName = transformTagName(name);
    return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
  }

  visitor() {
    return {
      // eslint-disable-next-line complexity
      MustacheStatement(node, visitorPath) {
        let parents = [...visitorPath.parents()];

        let inAttrNode = parents.find((it) => it.node.type === 'AttrNode');
        if (inAttrNode) {
          // <Foo @bar={{baz}} />
          return;
        }

        let { path } = node;
        if (path.type !== 'PathExpression') {
          // {{42}}
          // {{true}}
          // {{"foo-bar"}}
          return;
        }

        if (path.original === 'link-to') {
          // {{link-to "bar" "foo"}}
          this.logNode({ message: this.generateError('link-to'), node });
          return;
        }

        if (node.params.length !== 0) {
          // {{foo bar}}
          return;
        }

        let name = path.original;

        if (ALWAYS_CURLY.has(name)) {
          // {{yield}}
          return;
        }

        let hasNamedArguments = node.hash.pairs.length !== 0;
        if (hasNamedArguments) {
          if (path.parts.length > 1) {
            // {{foo.bar bar=baz}}
            this.logNode({ message: this.generateError(name), node });
            return;
          }

          if (this.config.allow.includes(name)) {
            return;
          }

          if (['input', 'textarea'].includes(name)) {
            // {{input type="text" value=this.model.name}}
            // {{textarea value=this.model.body}}
            this.logNode({ message: this.generateError(name), node });
            return;
          }

          if (this.config.requireDash && !name.includes('-')) {
            // {{foo bar=baz}}
            return;
          }

          if (BUILT_INS.has(name)) {
            // {{app-version versionOnly=true}}
            return;
          }

          // {{foo-bar bar=baz}}
          this.logNode({ message: this.generateError(name), node });
        } else {
          let isExplicitThis = path.this || path.data;
          let isLocal = this.isLocal(path);

          if (path.parts.length > 1) {
            // {{foo.bar}}
            if (this.config.noImplicitThis && !isExplicitThis && !isLocal) {
              this.logNode({ message: this.generateError(name), node });
            }

            return;
          }

          if (this.config.allow.includes(name)) {
            return;
          }

          if (this.config.disallow.includes(name) && !isLocal) {
            this.logNode({ message: this.generateError(name), node });
            return;
          }

          if (BUILT_INS.has(name)) {
            // {{debugger}}
            // {{outlet}}
            // {{yield}}
            return;
          }

          if (name.includes('-') || name.includes('/')) {
            // {{foo-bar}}
            // {{nested/component}}
            this.logNode({ message: this.generateError(name), node });
            return;
          }

          // {{foo}}
          if (this.config.noImplicitThis && !isExplicitThis && !isLocal) {
            this.logNode({ message: this.generateError(name), node });
          }
        }
      },

      BlockStatement(node) {
        if (node.inverse) {
          // {{#foo}}bar{{else}}baz{{/foo}}
          return;
        }

        let { path } = node;
        if (path.type !== 'PathExpression') {
          return;
        }

        if (path.original === 'link-to') {
          // {{#link-to "foo"}}bar{{/link-to}}
          this.logNode({ message: this.generateError('link-to'), node });
          return;
        }

        if (node.params.length !== 0) {
          // {{#foo bar}}{{/foo}}
          return;
        }

        if (this.config.allow.includes(path.original)) {
          return;
        }

        // {{#foo}}{{/foo}}
        // {{#foo bar=baz}}{{/foo}}
        this.logNode({ message: this.generateError(path.original), node });
      },
    };
  }
};

function parseConfig(config) {
  if (config === true) {
    return DEFAULT_CONFIG;
  }

  if (config && typeof config === 'object') {
    return {
      allow: 'allow' in config ? config.allow : DEFAULT_CONFIG.allow,
      disallow: 'disallow' in config ? config.disallow : DEFAULT_CONFIG.disallow,
      requireDash: 'requireDash' in config ? config.requireDash : DEFAULT_CONFIG.requireDash,
      noImplicitThis:
        'noImplicitThis' in config ? config.noImplicitThis : DEFAULT_CONFIG.noImplicitThis,
    };
  }

  let errorMessage = createErrorMessage(
    'no-curly-component-invocation',
    [
      '  * boolean - `true` to enable / `false` to disable',
      '  * object -- An object with the following keys:',
      '    * `allow` -- array: A list of whitelisted helpers to be allowed used with curly component syntax',
      '    * `disallow` -- array: A list of component names to not allow use with curly component syntax',
      '    * `requireDash` -- boolean: The codemod assumes that all components have a dash in their name. `true` to enable (default) / `false` to disable',
    ],
    config
  );

  throw new Error(errorMessage);
}

module.exports.parseConfig = parseConfig;
