import Rule from './_base.js';

export default class NoTripleCurlies extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoTripleCurlies>}
   */
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
