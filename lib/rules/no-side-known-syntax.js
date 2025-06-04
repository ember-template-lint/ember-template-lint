import Rule from './_base.js';
import { builders as b } from 'ember-template-recast';

/**
 *
 * @param {string} str
 */
function isSingleMustacheString(str) {
  return str.split('{').length === 2 && str.split('}').length === 2;
}

export default class NoSideKnownSyntax extends Rule {
  seenNodes = new WeakSet();
  /**
   * @returns {import('./types.js').VisitorReturnType<NoSideKnownSyntax>}
   */
  visitor() {
    return {
      TextNode(node) {
        const value = node.chars.trim();
        if (!isSingleMustacheString(value)) {
          return;
        }
        if (this.mode === 'fix') {
          let left = value.split('{')[0];
          let right = value.split('}')[1];
          let content = value
            .replace(`${left}{`, '')
            .replace(`}${right}`, '')
            .replace('(', ' ')
            .replace(')', ' ')
            .split(',')
            .join(' ')
            .trim()
            .split(' ')
            .filter((el) => el.trim().length)
            .join(' ');
          if (left.endsWith('$')) {
            left = left.slice(0, -1);
          }
          if (left.length && right.length) {
            return [b.text(left), b.mustache(b.path(content)), b.text(right)];
          } else if (left.length) {
            return [b.text(left), b.mustache(b.path(content))];
          } else if (right.length) {
            return [b.mustache(b.path(content)), b.text(right)];
          } else {
            return b.mustache(b.path(content));
          }
        } else {
          this.log({
            node,
            message: `It seems incorrect curly expression is used {path} instead of {{path}}`,
            isFixable: true,
          });
        }
      },
      ElementNode(node) {
        const maybeBooleanStringArgument = node.attributes.find(
          (attr) =>
            attr.name.startsWith('@') &&
            attr.value.type === 'TextNode' &&
            ['true', 'false'].includes(attr.value.chars)
        );
        const angularLikeParam = node.attributes.find(
          (attr) => attr.name.startsWith('[') && attr.name.endsWith(']')
        );
        const maybeNumericStringArgument = node.attributes.find(
          (attr) =>
            attr.name.startsWith('@') &&
            attr.value.type === 'TextNode' &&
            String(Number(attr.value.chars)) === attr.value.chars
        );
        const vForAttr = node.attributes.find(
          (attr) => attr.name === 'v-for' || attr.name.includes('[ngFor]') || attr.name === 'x-for'
        );
        const vIfAttr = node.attributes.find(
          (attr) =>
            attr.name === 'v-if' ||
            attr.name.includes('[ngIf]') ||
            attr.name === 'x-show' ||
            attr.name === 'x-if'
        );
        const xTextAttr = node.attributes.find((attr) => attr.name === 'x-text');
        const vSlot =
          node.attributes.find((attr) => attr.name.startsWith('v-slot:')) ||
          (node.tag === 'template' && node.attributes.find((attr) => attr.name.startsWith('#')));
        const vSlotArgsUsage =
          node.attributes.find((attr) => attr.name === 'v-slot') ||
          (node.tag === 'template' &&
            node.attributes.find(
              (attr) =>
                attr.name.startsWith('#') &&
                attr.value.type === 'TextNode' &&
                attr.value.chars.length > 0
            ));
        const isSlotDefinition = node.tag === 'slot';
        if (vForAttr && vForAttr.value.type === 'TextNode') {
          let [item, collection] = vForAttr.value.chars.split(' in ').map((el) => el.trim());
          if (!collection) {
            [item, collection] = vForAttr.value.chars.split(';')[0].split(' of ');
          }
          if (this.seenNodes.has(node)) {
            return;
          }
          if (this.mode === 'fix') {
            if (!collection.startsWith('this.')) {
              collection = `this.${collection}`;
            }
            const itemName = item.trim().split(' ').pop();
            node.attributes = node.attributes.filter((el) => el !== vForAttr && el.name !== ':key');
            for (const attr of node.attributes) {
              if (attr.name.startsWith(':') && attr.value.type === 'TextNode') {
                if (attr.value.chars.trim().startsWith(itemName.trim())) {
                  attr.value = b.mustache(b.path(attr.value.chars));
                  attr.name = attr.name.slice(1);
                }
              }
            }
            this.seenNodes.add(node);
            return b.block(
              b.path('each'),
              [b.path(collection)],
              b.hash([]),
              b.blockItself(
                [b.text('\n'), ...(node.tag === 'template' ? node.children : [node]), b.text('\n')],
                [itemName]
              )
            );
          } else {
            this.log({
              node: vForAttr,
              message: `${vForAttr.name} attribute is not supported, use {{#each items as |item|}} notation`,
              isFixable: true,
            });
          }
        }
        if (vIfAttr && vIfAttr.value.type === 'TextNode') {
          if (this.mode === 'fix') {
            node.attributes = node.attributes.filter((el) => el !== vIfAttr);
            this.seenNodes.add(node);
            let condition = vIfAttr.value.chars;
            if (!condition.startsWith('this.') && !condition.startsWith('$')) {
              condition = `this.${condition}`;
            }
            if (condition.startsWith('$slots.')) {
              condition = b.sexpr(b.path('has-block'), [
                b.string(condition.replace('$slots.', '')),
              ]);
            }
            const children = [];
            if (node.tag === 'ng-template' || node.tag === 'template') {
              children.push(...node.children);
            } else {
              children.push(node);
            }
            return b.block(
              b.path('if'),
              [typeof condition === 'string' ? b.path(condition) : condition],
              b.hash([]),
              b.blockItself([b.text('\n'), ...children, b.text('\n')], [])
            );
          } else {
            this.log({
              node: vIfAttr,
              message: `${vIfAttr.name} attribute is not supported, use {{#if condition}} scope {{/if}} notation.`,
              isFixable: true,
            });
          }
        }
        if (vSlot) {
          const properName = vSlot.name.replace('v-slot', '').replace('#', ':');
          if (this.mode === 'fix') {
            this.seenNodes.add(node);
            node.tag = properName;
            node.attributes = [];
          } else {
            this.log({
              node,
              message: `Incorrect slot definition used, use <${properName}></${properName}> instead`,
              isFixable: true,
            });
          }
        }
        if (isSlotDefinition) {
          const slotName =
            node.attributes.find((attr) => attr.name === 'name') ||
            b.attr('name', b.text('default'));
          if (slotName.value.type !== 'TextNode') {
            return;
          }
          const hashParams = node.attributes
            .filter((attr) => attr.name.startsWith(':'))
            .map((el) => {
              return b.pair(
                el.name.replace(':', ''),
                el.value.type === 'TextNode'
                  ? b.string(el.value.chars)
                  : el.value.type === 'MustacheStatement'
                    ? b.sexpr(el.value.path, el.value.params, el.value.hash)
                    : el.value
              );
            });
          if (this.mode === 'fix') {
            if (slotName.value.chars === 'default') {
              return b.mustache(
                b.path('yield'),
                hashParams.length ? [b.sexpr(b.path('hash'), [], b.hash(hashParams))] : []
              );
            } else {
              return b.mustache(
                b.path('yield'),
                hashParams.length ? [b.sexpr(b.path('hash'), [], b.hash(hashParams))] : [],
                b.hash([b.pair('to', b.string(slotName.value.chars))])
              );
            }
          } else {
            this.log({
              node,
              isFixable: true,
              message: `Incorrect named block definition is used, prefer {{yield to="name"}} notation.`,
            });
          }
        }
        if (vSlotArgsUsage) {
          if (vSlotArgsUsage.value.type !== 'TextNode') {
            return;
          }
          if (this.mode === 'fix') {
            const argName = vSlotArgsUsage.value.chars;
            node.blockParams = [argName];
            node.attributes = node.attributes.filter((el) => el !== vSlotArgsUsage);
          } else {
            this.log({
              node: vSlotArgsUsage,
              message: `Incorrect slot arguments usage, prefer |args| notation.`,
              isFixable: true,
            });
          }
        }
        if (xTextAttr && xTextAttr.value.type === 'TextNode' && node.children.length === 0) {
          if (this.mode === 'fix') {
            node.attributes = node.attributes.filter((el) => el !== xTextAttr);
            this.seenNodes.add(node);
            node.children = [b.mustache(b.path(xTextAttr.value.chars))];
          } else {
            this.log({
              node: xTextAttr,
              message: `${xTextAttr.name} attribute is not supported, use {{value}} notation`,
              isFixable: true,
            });
          }
        }
        if (maybeBooleanStringArgument) {
          const originalValue = maybeBooleanStringArgument.value?.chars;
          const originalSource = this.sourceForNode(maybeBooleanStringArgument);
          const isEscaped = originalSource.endsWith(`'`) || originalSource.endsWith('"');
          if (!isEscaped) {
            if (this.mode === 'fix') {
              maybeBooleanStringArgument.value = b.mustache(b.boolean(originalValue === 'true'));
            } else {
              this.log({
                node: maybeBooleanStringArgument,
                message: `Incorrect boolean string usage, prefer ${maybeBooleanStringArgument.name}={{${originalValue}}} notation.`,
                isFixable: true,
              });
            }
          }
        }
        if (maybeNumericStringArgument) {
          const originalValue = maybeNumericStringArgument.value?.chars;
          const originalSource = this.sourceForNode(maybeNumericStringArgument);
          const isEscaped = originalSource.endsWith(`'`) || originalSource.endsWith('"');
          if (!isEscaped) {
            if (this.mode === 'fix') {
              maybeNumericStringArgument.value = b.mustache(b.number(Number(originalValue)));
            } else {
              this.log({
                node: maybeNumericStringArgument,
                message: `Incorrect numeric string usage, prefer ${maybeNumericStringArgument.name}={{${originalValue}}} notation.`,
                isFixable: true,
              });
            }
          }
        }
        if (angularLikeParam && angularLikeParam.value.type === 'TextNode') {
          if (this.mode === 'fix') {
            angularLikeParam.name = angularLikeParam.name.replace('[', '@').replace(']', '').replace('(', '').replace(')', '');
            angularLikeParam.value = b.mustache(b.path(angularLikeParam.value.chars));
          } else {
            this.log({
              node: angularLikeParam,
              message: `Angular-like [param] binding not supported, use @param notation.`,
              isFixable: true,
            });
          }
        }
      },
    };
  }
}
