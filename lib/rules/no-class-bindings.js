'use strict';

const { builders: b } = require('ember-template-recast');

const Rule = require('./base');

// from
// https://github.com/emberjs/ember.js/blob/v3.25.1/packages/@ember/string/index.ts#L12-L16
// https://github.com/emberjs/ember.js/blob/v3.25.1/packages/@ember/string/index.ts#L63-L67

const STRING_DECAMELIZE_REGEXP = /([\da-z])([A-Z])/g;
const STRING_DASHERIZE_REGEXP = /[ _]/g;

function dasherize(str) {
  let decamelizedString = str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();

  return decamelizedString.replace(STRING_DASHERIZE_REGEXP, '-');
}

module.exports = class NoClassBindings extends Rule {
  visitor() {
    let check = (node) => {
      let isAttrNode = node.type === 'AttrNode';
      let specifiedKey = isAttrNode ? node.name : node.key;
      let argumentName = isAttrNode ? node.name : `@${node.key}`;

      if (argumentName === '@classBinding' || argumentName === '@classNameBindings') {
        let isFixable = node.value.type === 'StringLiteral' || node.value.type === 'TextNode';

        this.log({
          message: `Passing the \`${specifiedKey}\` property as an argument within templates is not allowed.`,
          node,
          isFixable,
        });
      }
    };

    function fixElement(node) {
      let classNameBindingAttributes = node.attributes.filter(
        (a) => a.name === '@classNameBindings' || a.name === '@classBinding'
      );

      if (classNameBindingAttributes.length === 0) {
        // nothing to do
        return;
      }

      let classParts = [];

      for (let classNameBindingAttribute of classNameBindingAttributes) {
        if (classNameBindingAttribute.value.type !== 'TextNode') {
          // we cannot fix non-TextNode's
          check(classNameBindingAttribute);
          continue;
        }

        let segments = classNameBindingAttribute.value.chars.split(' ');

        for (let segment of segments) {
          let [propName, activeClass, inactiveClass] = segment.split(':');

          let ifStatement = b.mustache('if', [b.path(`this.${propName}`)]);

          if (activeClass) {
            ifStatement.params.push(b.string(activeClass));
          } else {
            ifStatement.params.push(b.string(dasherize(propName)));
          }

          if (inactiveClass) {
            ifStatement.params.push(b.string(inactiveClass));
          }

          if (classParts.length > 0) {
            classParts.push(b.text(' '));
          }

          classParts.push(ifStatement);
        }

        node.attributes = node.attributes.filter((a) => a !== classNameBindingAttribute);
      }

      if (classParts.length > 0) {
        let classAttr = node.attributes.find((a) => a.name === 'class');

        if (classAttr) {
          if (classAttr.value.type === 'ConcatStatement') {
            classAttr.value.parts.push(b.text(' '), classParts);
          } else {
            // eslint-disable-next-line unicorn/prefer-spread
            classAttr.value = b.concat([classAttr.value, b.text(' '), ...classParts]);
          }
        } else {
          // eslint-disable-next-line unicorn/prefer-spread
          node.attributes.push(b.attr('class', b.concat(classParts)));
        }
      }
    }

    function fixMustacheLike(node) {
      let classNameBindingAttributes = node.hash.pairs.filter(
        (hp) => hp.key === 'classNameBindings' || hp.key === 'classBinding'
      );

      if (classNameBindingAttributes.length === 0) {
        // nothing to do
        return;
      }

      let classParts = [];

      for (let classNameBindingAttribute of classNameBindingAttributes) {
        if (classNameBindingAttribute.value.type !== 'StringLiteral') {
          // we cannot fix non-static values
          check(classNameBindingAttribute);
          continue;
        }

        let segments = classNameBindingAttribute.value.value.split(' ');

        for (let segment of segments) {
          let [propName, activeClass, inactiveClass] = segment.split(':');

          let ifStatement = b.sexpr('if', [b.path(`this.${propName}`)]);

          if (activeClass) {
            ifStatement.params.push(b.string(activeClass));
          } else {
            ifStatement.params.push(b.string(dasherize(propName)));
          }

          if (inactiveClass) {
            ifStatement.params.push(b.string(inactiveClass));
          }

          if (classParts.length > 0) {
            classParts.push(b.string(' '));
          }

          classParts.push(ifStatement);
        }

        node.hash.pairs = node.hash.pairs.filter((a) => a !== classNameBindingAttribute);
      }

      if (classParts.length > 0) {
        let classAttr = node.hash.pairs.find((a) => a.key === 'class');
        let hasClass = Boolean(classAttr);

        if (hasClass) {
          if (
            classAttr.value.type === 'SubExpression' &&
            classAttr.value.path.type === 'PathExpression' &&
            classAttr.value.path.original === 'concat'
          ) {
            classAttr.value.params.push(b.string(' '), ...classParts);
          } else {
            classAttr.value = b.sexpr('concat', [classAttr.value, b.string(' '), ...classParts]);
          }
        } else if (classParts.length === 1) {
          node.hash.pairs.push(b.pair('class', classParts[0]));
        } else {
          node.hash.pairs.push(b.pair('class', b.sexpr('concat', classParts)));
        }
      }
    }

    if (this.mode === 'fix') {
      return {
        ElementNode: fixElement,
        MustacheStatement: fixMustacheLike,
        BlockStatement: fixMustacheLike,
      };
    } else {
      // much simpler when not in --fix mode
      return {
        AttrNode: check,
        HashPair: check,
      };
    }
  }
};
