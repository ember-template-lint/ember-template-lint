import { builders as b } from 'ember-template-recast';

import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

const messages = {
  followingElseBlock: 'Using an {{else}} block with {{unless}} should be avoided.',
  asElseUnlessBlock: 'Using an `{{else unless}}` block should be avoided.',
  withHelper: 'Using {{unless}} in combination with other helpers should be avoided.',
};

const DEFAULT_CONFIG = {
  allowlist: [],
  denylist: [],
  maxHelpers: 1,
};

function isValidConfigObjectFormat(config) {
  for (let key in DEFAULT_CONFIG) {
    let value = config[key];
    let valueIsArray = Array.isArray(value);

    if (value === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    } else if (['allowlist', 'denylist'].includes(key) && !valueIsArray) {
      return false;
    }
  }

  return true;
}

export default class SimpleUnless extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        if (isValidConfigObjectFormat(config)) {
          return config;
        }
        break;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean -- `true` for enabled / `false` for disabled\n' +
          '  * object --\n' +
          "    *  `allowlist` -- array - `['or']` for specific helpers / `[]` for wildcard\n" +
          "    *  `denylist` -- array - `['or']` for specific helpers / `[]` for none\n" +
          '    *  `maxHelpers` -- number - default `1` - use `-1` for no limit',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      MustacheStatement(node) {
        const fixMode = this.mode === 'fix';
        if (node.path.original === 'unless' && node.params[0].path) {
          this._withHelper(node, fixMode);
        }
      },

      BlockStatement(node) {
        const nodeInverse = node.inverse;
        const fixMode = this.mode === 'fix';

        if (nodeInverse) {
          if (AstNodeInfo.isUnless(node)) {
            if (nodeInverse.body[0] && AstNodeInfo.isIf(nodeInverse.body[0])) {
              this._followingElseIfBlock(node);
            } else {
              this._followingElseBlock(node, fixMode);
            }
          } else if (this._isElseUnlessBlock(nodeInverse.body[0])) {
            this._asElseUnlessBlock(node);
          }
        } else if (AstNodeInfo.isUnless(node) && node.params[0].path) {
          this._withHelper(node, fixMode);
        }
      },
    };
  }

  _followingElseBlock(block, fixMode) {
    if (fixMode) {
      const programBody = block.program.body;
      block.program.body = block.inverse.body;
      block.inverse.body = programBody;
      block.path.original = 'if';
      return;
    }
    let node = block.program;
    let actual = '{{else}}';

    this._logMessage(node, messages.followingElseBlock, actual, true);
  }

  _followingElseIfBlock(block) {
    let inverse = block.inverse;
    let node = block.program;
    let parameter = inverse.body[0].params[0].original;
    let actual = `{{else if ${parameter}}}`;

    this._logMessage(node, messages.followingElseBlock, actual);
  }

  _asElseUnlessBlock(block) {
    let inverse = block.inverse;
    let node = inverse.body[0];
    let actual = '{{else unless ...';

    this._logMessage(node, messages.asElseUnlessBlock, actual);
  }

  _withHelper(node, fixMode) {
    let { allowlist = [], denylist = [], maxHelpers } = this.config;
    let params;
    let nextParams = node.params;
    let helperCount = 0;
    let containsSubExpression = false;
    let shouldFix = false;

    do {
      params = nextParams;
      nextParams = [];

      for (const param of params) {
        if (param.type === 'SubExpression') {
          if (++helperCount > maxHelpers && maxHelpers > -1) {
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} MaxHelpers: ${maxHelpers}`;

            this._logMessage(param, message, actual, true);
            shouldFix = true;
          }

          if (allowlist.length > 0 && !allowlist.includes(param.path.original)) {
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} Allowed helper${
              allowlist.length > 1 ? 's' : ''
            }: ${allowlist.toString()}`;

            this._logMessage(param, message, actual, true);
            shouldFix = true;
          }

          if (denylist.length > 0 && denylist.includes(param.path.original)) {
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} Restricted helper${
              denylist.length > 1 ? 's' : ''
            }: ${denylist.toString()}`;

            this._logMessage(param, message, actual, true);
            shouldFix = true;
          }

          for (const p of param.params) {
            nextParams.push(p); // nextParams.push(...param.params);
          }
        }
      }

      containsSubExpression = nextParams.some((param) => param.type === 'SubExpression');
    } while (containsSubExpression);
    if (fixMode && shouldFix) {
      node.path.original = 'if';
      if (node.params[0].type === 'SubExpression' && node.params[0].path.original === 'not') {
        // skip creating subexpression so we won't create `(not (not` chain
        if (node.params[0].params.length > 1) {
          node.params[0].path.original = 'or';
          return;
        }
        const [nothelper, ...rest] = [...node.params];
        node.params = nothelper.params;
        node.params.push(...rest);
        return;
      }
      node.params[0] = b.sexpr('not', [node.params[0]]);
    }
  }

  _isElseUnlessBlock(node) {
    return (
      node &&
      node.path &&
      node.path.original === 'unless' &&
      this.sourceForNode(node).startsWith('{{else ')
    );
  }

  _logMessage(node, message, source, isFixable = false) {
    return this.log({
      message,
      node,
      source,
      isFixable,
    });
  }
}
