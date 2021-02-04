'use strict';

const Fuse = require('fuse.js');

const Rule = require('./base');

// from https://github.com/emberjs/rfcs/blob/master/text/0707-modernize-built-in-components-2.md#summary
const KnownArguments = {
  LinkTo: {
    arguments: [
      'route',
      'model',
      'models',
      'query',
      'replace',
      'disabled',
      'current-when',
      'activeClass',
      'loadingClass',
      'disabledClass',
    ],
    conflicts: [['model', 'models']],
    required: ['route'],
  },
  Input: {
    arguments: ['type', 'value', 'checked', 'insert-newline', 'enter', 'escape-press'],
    conflicts: [['checked', 'value']],
  },
  Textarea: {
    arguments: ['value', 'insert-newline', 'enter', 'escape-press'],
  },
};

function ERROR_MESSAGE(tagName, argumentName) {
  const candidates = KnownArguments[tagName].arguments;
  const pureQuery = argumentName.replace('@', '');
  let query = pureQuery;
  let fuzzyResults = [];

  while (!fuzzyResults.length && query.length) {
    fuzzyResults = new Fuse(candidates).search(query);
    query = query.slice(0, -1);
  }

  const msg = `"${argumentName}" is unknown argument for <${tagName} /> component.`;
  if (fuzzyResults.length) {
    return `${msg} Did you mean "@${fuzzyResults[0].item}"?`;
  } else {
    return msg;
  }
}

function REQUIRED_MESSAGE(tagName, argumentNames) {
  return `Argument${argumentNames.length > 1 ? 's' : ''} ${argumentNames
    .map((el) => `"@${el}"`)
    .join(' or ')} is required for <${tagName} /> component.`;
}

function CONFLICT_MESSAGE(argumentName, rawList) {
  const conflictsList = rawList.filter((el) => `@${el}` !== argumentName);
  return `"${argumentName}" conflicts with ${conflictsList
    .map((el) => `"@${el}"`)
    .join(', ')}, only one should exists.`;
}

function isArgument(attributeNode) {
  return attributeNode.name.startsWith('@');
}

function pureName(attributeNode) {
  return attributeNode.name.replace('@', '');
}

module.exports = class NoUnknownArgumentsForBuiltinComponents extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let nodeMeta = KnownArguments[node.tag];
        if (!nodeMeta) {
          return;
        }

        let warns = [];
        let seen = [];

        const logError = (attr) => {
          this.log({
            message: ERROR_MESSAGE(node.tag, attr.name),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: (this.sourceForNode(attr) || '').split('=')[0],
          });
        };

        const logConflict = (attr, conflictList) => {
          this.log({
            message: CONFLICT_MESSAGE(attr.name, conflictList),
            line: attr.loc && attr.loc.start.line,
            column: attr.loc && attr.loc.start.column,
            source: (this.sourceForNode(attr) || '').split('=')[0],
          });
        };

        const logRequired = (variants) => {
          this.log({
            message: REQUIRED_MESSAGE(node.tag, variants),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column + 1,
            source: node.tag,
          });
        };

        for (let argument of node.attributes) {
          if (!isArgument(argument)) {
            continue;
          }
          const argumentName = pureName(argument);
          if (!nodeMeta.arguments.includes(argumentName)) {
            warns.push(argument);
          } else {
            seen.push(argumentName);
          }
        }

        for (let warn of warns) {
          logError(warn);
        }

        if ('conflicts' in nodeMeta) {
          for (let conflictList of nodeMeta.conflicts) {
            if (conflictList.every((item) => seen.includes(item))) {
              for (let argumentName of conflictList) {
                const attr = node.attributes.find(({ name }) => `@${argumentName}` === name);
                if (attr) {
                  logConflict(attr, conflictList);
                }
              }
            }
          }
        }

        if ('required' in nodeMeta) {
          for (let requiredItems of nodeMeta.required) {
            let variants = Array.isArray(requiredItems) ? requiredItems : [requiredItems];

            if (!variants.some((el) => seen.includes(el))) {
              logRequired(variants);
            }
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
module.exports.CONFLICT_MESSAGE = CONFLICT_MESSAGE;
module.exports.REQUIRED_MESSAGE = REQUIRED_MESSAGE;
