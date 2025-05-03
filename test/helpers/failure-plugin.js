import { Rule } from '../../lib/index.js';

// Easily controllable failure for acceptance tests
class FailOnWord extends Rule {
  visitor() {
    return {
      TextNode(node) {
        const bad = this.config;
        if (node.chars.includes(bad)) {
          this.log({
            message: `The string "${bad}" is forbidden in templates`,
            node,
          });
        }
      },
    };
  }
}

export default {
  name: 'test-helper-failure-plugin',
  rules: {
    'fail-on-word': FailOnWord,
  },
};
