import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE =
  'Media elements such as <audio> and <video> must have a <track> for captions.';

const mediaTypes = new Set(['audio', 'video']);

function hasTrackWithCaptions(nodes) {
  for (let node of nodes) {
    if (node.tag === 'track') {
      let kindAttribute = AstNodeInfo.findAttribute(node, 'kind');
      if (kindAttribute && kindAttribute.value.chars === 'captions') {
        return true;
      }
    }
  }
}

export default class RequireMediaCaption extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (!mediaTypes.has(node.tag)) {
          return;
        }

        const mutedAttribute = AstNodeInfo.findAttribute(node, 'muted');
        if (mutedAttribute) {
          if (
            ['MustacheStatement', 'BlockStatement'].includes(mutedAttribute.value.type) ||
            ![false, 'false'].includes(mutedAttribute.value.chars)
          ) {
            return;
          }
        }

        if (
          !AstNodeInfo.hasChildren(node) ||
          !hasTrackWithCaptions(AstNodeInfo.childrenFor(node))
        ) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}
