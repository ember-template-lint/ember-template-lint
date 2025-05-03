import { builders } from 'ember-template-recast';
import Fuse from 'fuse.js';

import Rule from './_base.js';

function deprecateArgument(componentName, argumentName, replacementAttribute) {
  const msgs = [`Passing the "${argumentName}" argument to <${componentName} /> is deprecated.`];
  if (replacementAttribute) {
    msgs.push(
      `Instead, please pass the attribute directly, i.e. "<${componentName} ${replacementAttribute}={{...}} />" instead of "<${componentName} ${argumentName}={{...}} />".`
    );
  }
  return msgs.join('\n');
}

function deprecateEvent(componentName, argumentName, replacementAttribute) {
  const msgs = [`Passing the "${argumentName}" argument to <${componentName} /> is deprecated.`];
  if (replacementAttribute) {
    msgs.push(
      `Instead, please use the {{on}} modifier, i.e. "<${componentName} {{on "${replacementAttribute}" ...}} />" instead of "<${componentName} ${argumentName}={{...}} />".`
    );
  }
  return msgs.join('\n');
}

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
    deprecatedArguments: {
      // argument name -> replacement html attr
      '@active': '',
      '@loading': '',
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',

      '@tagName': '',
      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@rel': 'rel',
      '@tabindex': 'tabindex',
      '@target': 'target',
      '@title': 'title',
    },
    deprecatedEvents: {
      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@focusIn': 'focusin',
      '@focusOut': 'focusout',
      '@input': 'input',
      '@keyDown': 'keydown',
      '@keyPress': 'keypress',
      '@keyUp': 'keyup',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
    },
    conflicts: [['model', 'models']],
    required: [['route', 'query', 'model', 'models']],
  },
  Input: {
    arguments: ['type', 'value', 'checked', 'insert-newline', 'enter', 'escape-press'],
    deprecatedArguments: {
      '@bubbles': '',
      '@cancel': '',
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',

      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@accept': 'accept',
      '@autocapitalize': '',
      '@autocomplete': 'autocomplete',
      '@autocorrect': '',
      '@autofocus': 'autofocus',
      '@autosave': '',
      '@dir': 'dir',
      '@disabled': 'disabled',
      '@form': 'form',
      '@formaction': 'formaction',
      '@formenctype': 'formenctype',
      '@formmethod': 'formmethod',
      '@formnovalidate': 'formnovalidate',
      '@formtarget': 'formtarget',
      '@height': 'height',
      '@indeterminate': '',
      '@inputmode': '',
      '@lang': 'lang',
      '@list': 'list',
      '@max': 'max',
      '@maxlength': 'maxlength',
      '@min': 'min',
      '@minlength': 'minlength',
      '@multiple': 'multiple',
      '@name': 'name',
      '@pattern': 'pattern',
      '@placeholder': 'placeholder',
      '@readonly': 'readonly',
      '@required': 'required',
      '@selectionDirection': '',
      '@size': 'size',
      '@spellcheck': 'spellcheck',
      '@step': 'step',
      '@tabindex': 'tabindex',
      '@title': 'title',
      '@width': 'width',
    },
    conflicts: [['checked', 'value']],
    deprecatedEvents: {
      '@change': 'change',
      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@input': 'input',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
      '@focus-in': 'focusin',
      '@focus-out': 'focusout',
      '@key-down': 'keydown',
      '@key-press': 'keypress',
      '@key-up': 'keyup',
    },
  },
  Textarea: {
    arguments: ['value', 'insert-newline', 'enter', 'escape-press'],
    deprecatedArguments: {
      '@init': '',
      '@didRender': '',
      '@willDestroy': '',
      '@didReceiveAttrs': '',
      '@willRender': '',
      '@didInsertElement': '',
      '@didUpdateAttrs': '',
      '@willUpdate': '',
      '@didUpdate': '',
      '@willDestroyElement': '',
      '@willClearRender': '',
      '@didDestroyElement': '',

      '@id': 'id',
      '@elementId': 'id',
      '@ariaRole': 'role',
      '@class': 'class',
      '@classNames': 'class',
      '@classNameBindings': 'class',
      '@isVisible': 'style',
      '@autocapitalize': '',
      '@autocomplete': 'autocomplete',
      '@autocorrect': '',
      '@autofocus': 'autofocus',
      '@cols': 'cols',
      '@dir': 'dir',
      '@disabled': 'disabled',
      '@form': 'form',
      '@lang': 'lang',
      '@maxlength': 'maxlength',
      '@minlength': 'minlength',
      '@name': 'name',
      '@placeholder': 'placeholder',
      '@readonly': 'readonly',
      '@required': 'required',
      '@rows': 'rows',
      '@selectionDirection': '',
      '@selectionEnd': '',
      '@selectionStart': '',
      '@spellcheck': 'spellcheck',
      '@tabindex': 'tabindex',
      '@title': 'title',
      '@wrap': 'wrap',
    },
    deprecatedEvents: {
      '@bubbles': '',
      '@cancel': '',

      '@click': 'click',
      '@contextMenu': 'contextmenu',
      '@doubleClick': 'dblclick',
      '@drag': 'drag',
      '@dragEnd': 'dragend',
      '@dragEnter': 'dragenter',
      '@dragLeave': 'dragleave',
      '@dragOver': 'dragover',
      '@dragStart': 'dragstart',
      '@drop': 'drop',
      '@input': 'input',
      '@mouseDown': 'mousedown',
      '@mouseEnter': 'mouseenter',
      '@mouseLeave': 'mouseleave',
      '@mouseMove': 'mousemove',
      '@mouseUp': 'mouseup',
      '@submit': 'submit',
      '@touchCancel': 'touchcancel',
      '@touchEnd': 'touchend',
      '@touchMove': 'touchmove',
      '@touchStart': 'touchstart',
      '@focus-in': 'focusin',
      '@focus-out': 'focusout',
      '@key-down': 'keydown',
      '@key-press': 'keypress',
      '@key-up': 'keyup',
    },
  },
};

function removeAtSymbol(txt) {
  return txt.replace('@', '');
}

function fix(node, argument) {
  const tagMeta = KnownArguments[node.tag];
  const deprecatedArgs = tagMeta.deprecatedArguments || {};
  const replacementArg = deprecatedArgs[argument.name];
  if (replacementArg) {
    argument.name = replacementArg;
    return true;
  }
  const deprecatedEvents = tagMeta.deprecatedEvents || {};
  const replacementEvent = deprecatedEvents[argument.name];
  if (replacementEvent && argument.value.type === 'MustacheStatement') {
    let expr;
    if (argument.value.params.length > 0) {
      expr = builders.sexpr(argument.value.path, argument.value.params);
    } else {
      expr = argument.value.path;
    }
    const modifier = builders.elementModifier('on', [builders.string(replacementEvent), expr]);
    node.attributes.splice(node.attributes.indexOf(argument), 1);
    node.modifiers.push(modifier);
    return true;
  }
  return false;
}

function ERROR_MESSAGE(tagName, argumentName) {
  const tagMeta = KnownArguments[tagName];
  const deprecatedArgs = tagMeta.deprecatedArguments || {};
  const deprecatedEvents = tagMeta.deprecatedEvents || {};
  const candidates = [
    ...new Set([
      ...tagMeta.arguments,
      ...Object.keys(deprecatedArgs).map((e) => removeAtSymbol(e)),
      ...Object.keys(deprecatedEvents).map((e) => removeAtSymbol(e)),
    ]),
  ];
  const pureQuery = removeAtSymbol(argumentName);
  let query = pureQuery;
  let fuzzyResults = [];
  let hasArgumentsMatch = candidates.includes(pureQuery);

  while (!fuzzyResults.length && query.length) {
    fuzzyResults = new Fuse(candidates).search(query);
    query = query.slice(0, -1);
  }

  if (!hasArgumentsMatch) {
    const msg = `"${argumentName}" is not a known argument for the <${tagName} /> component.`;
    if (fuzzyResults.length) {
      return `${msg} Did you mean "@${fuzzyResults[0].item}"?`;
    } else {
      return msg;
    }
  }

  if (argumentName in deprecatedArgs) {
    return deprecateArgument(tagName, argumentName, deprecatedArgs[argumentName]);
  }

  if (argumentName in deprecatedEvents) {
    return deprecateEvent(tagName, argumentName, deprecatedEvents[argumentName]);
  }

  return `"${argumentName}" is unknown argument for <${tagName} /> component.`;
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
  return removeAtSymbol(attributeNode.name);
}

export default class NoUnknownArgumentsForBuiltinComponents extends Rule {
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
            node: attr,
            source: (this.sourceForNode(attr) || '').split('=')[0],
            isFixable: fix(node, attr),
          });
        };

        const logConflict = (attr, conflictList) => {
          this.log({
            message: CONFLICT_MESSAGE(attr.name, conflictList),
            node: attr,
            source: (this.sourceForNode(attr) || '').split('=')[0],
          });
        };

        const logRequired = (variants) => {
          this.log({
            message: REQUIRED_MESSAGE(node.tag, variants),
            node,
            column: node.loc && node.loc.start.column + 1,
            source: node.tag,
          });
        };

        for (let argument of node.attributes) {
          if (!isArgument(argument)) {
            continue;
          }
          const argumentName = pureName(argument);
          if (nodeMeta.arguments.includes(argumentName)) {
            seen.push(argumentName);
          } else {
            warns.push(argument);
          }
        }

        for (let warn of warns) {
          if (this.mode === 'fix') {
            fix(node, warn);
          } else {
            logError(warn);
          }
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
}
