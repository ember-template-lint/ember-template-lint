import Rule from '../../../../lib/rules/_base.js';

let message = 'The inline form of component is not allowed';

export default class InlineComponent extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'component') {
          this.log({
            message,
            node,
          });
        }
      },
    };
  }
}
