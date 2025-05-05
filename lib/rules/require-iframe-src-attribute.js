import Rule from './_base.js';
import { builders as b } from 'ember-template-recast';

export const ERROR_MESSAGE =
  'Security Risk: `<iframe>` must include a static `src` attribute. Otherwise, CSP `frame-src` is bypassed and `about:blank` inherits parent origin, creating an elevated-privilege frame.';

export default class RequireIframeSrcAttribute extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<RequireIframeSrcAttribute>}
   */
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'iframe') {
          const hasSrcAttribute = node.attributes.find((el) => el.name === 'src');
          if (!hasSrcAttribute) {
            if (this.mode === 'fix') {
              node.attributes.push(b.attr('src', b.text('about:blank')));
            } else {
              this.log({
                message: ERROR_MESSAGE,
                node,
                isFixable: true,
              });
            }
          }
        }
      },
    };
  }
}
