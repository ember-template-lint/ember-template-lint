import Rule from './_base.js';

export default class NoQuotelessAttributes extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { isValueless, name, quoteType, value } = node;

        if (isValueless) {
          return;
        }
        if (value.type !== 'TextNode') {
          return;
        }

        if (quoteType === null) {
          let type = name.startsWith('@') ? 'Argument' : 'Attribute';

          if (this.mode === 'fix') {
            node.quoteType = '"';
          } else {
            this.log({
              message: `${type} ${name} should be either quoted or wrapped in mustaches`,
              node,
              source: this.sourceForNode(node),
              isFixable: true,
            });
          }
        }
      },
    };
  }
}
