import Rule from './_base.js';

export default class NoTripleCurlies extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (!node.escaped) {
          this.log({
            message: 'Usage of triple curly brackets is unsafe',
            node,
            source: `{{{${node.path.original}}}}`,
          });
        }
      },
    };
  }
}
