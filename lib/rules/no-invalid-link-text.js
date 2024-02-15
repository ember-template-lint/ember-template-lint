import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const DEFAULT_CONFIG = { allowEmptyLinks: false };
const DISALLOWED_LINK_TEXT = new Set([
  // WCAG F84-Provided Examples
  'click here',
  'more info',
  'read more',
  'more',
]);

function getTrimmedText(text) {
  const nbspRemoved = text.replaceAll('&nbsp;', ' ');
  return nbspRemoved.toLowerCase().trim();
}

function isHidden(element) {
  const ariaHiddenAttr = AstNodeInfo.findAttribute(element, 'aria-hidden');

  return (
    (ariaHiddenAttr && ariaHiddenAttr.value.chars === 'true') ||
    AstNodeInfo.hasAttribute(element, 'hidden')
  );
}

function hasValidAriaLabel(node) {
  const ariaLabelledbyAttr = AstNodeInfo.findAttribute(node, 'aria-labelledby');

  if (ariaLabelledbyAttr) {
    let ariaLabelledby = getTrimmedText(ariaLabelledbyAttr.value.chars);
    return ariaLabelledby.length > 0;
  }

  const ariaLabelAttr = AstNodeInfo.findAttribute(node, 'aria-label');

  if (ariaLabelAttr) {
    if (ariaLabelAttr.value?.type === 'MustacheStatement') {
      // We can't evaluate MustacheStatements so we assume this is valid
      return true;
    }
    let ariaLabel = getTrimmedText(ariaLabelAttr.value.chars);
    return !DISALLOWED_LINK_TEXT.has(ariaLabel);
  }
}

function hasInvalidLinkText(node, allowEmptyLinks) {
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter((child) => child.type === 'TextNode');
  let linkTexts;

  if (nodeChildren.length !== textChildren.length) {
    // do not flag an error when the link contains additional dynamic (non-text) children
    return;
  }

  if (allowEmptyLinks) {
    linkTexts = textChildren.map((linkText) => linkText['chars'].toLowerCase().trim());
  } else {
    if (isHidden(node) || hasValidAriaLabel(node)) {
      return;
    }

    if (!nodeChildren.length) {
      return true;
    }

    linkTexts = textChildren.map((linkText) => getTrimmedText(linkText.chars));
    DISALLOWED_LINK_TEXT.add('');
  }

  // Check to see if the text content is too `generic` by checking it against
  // the reference list (array, above) of `disallowed` link text Strings/phrases
  const hasGenericLinkTexts = linkTexts.some((linkText) => DISALLOWED_LINK_TEXT.has(linkText));
  return hasGenericLinkTexts;
}

export default class NoInvalidLinkText extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        return { allowEmptyLinks: config.allowEmptyLinks };
      }
      case 'undefined': {
        return false;
      }
    }
  }

  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          // Report if one or more child TextNode element(s) is on the disallowed list
          if (hasInvalidLinkText(node, this.config.allowEmptyLinks)) {
            this.log({
              message: 'Links should have descriptive text',
              node,
            });
          }
        }
      },
      BlockStatement(node) {
        if (node.path.original === 'link-to') {
          // Report if one or more child TextNode element(s) is on the disallowed list
          if (hasInvalidLinkText(node, this.config.allowEmptyLinks)) {
            this.log({
              message: 'Links should have descriptive text',
              node,
            });
          }
        }
      },
    };
  }
}
