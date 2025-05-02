import Rule from './_base.js';

const componentTemplateRegex = new RegExp(
  'templates/components|components/.*/template|ui/components|-components/'
);

export default class NoAttrsInComponents extends Rule {
  isComponentTemplate() {
    return componentTemplateRegex.test(this._filePath);
  }
  visitor() {
    return {
      PathExpression(node) {
        if (!this.isComponentTemplate()) {
          return;
        }
        if (node.parts && node.parts[0] === 'attrs') {
          this.log({
            message: 'Component templates should not contain `attrs`.',
            node,
          });
        }
      },
    };
  }
}
