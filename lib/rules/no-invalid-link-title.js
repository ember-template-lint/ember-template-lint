import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

function hasInvalidLinkTitle(node, titleAttributeValues) {
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter((child) => child.type === 'TextNode');
  const linkTexts = textChildren
    .map((linkText) => linkText.chars.toLowerCase().trim())
    .filter((text) => text.length > 0);

  // Check to see if the text content includes the title attribute value
  const linkTextIncludesTitle = linkTexts.some((linkText) =>
    titleAttributeValues.some((title) => linkText.includes(title))
  );

  return linkTextIncludesTitle;
}

export default class NoInvalidLinkTitle extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          let hasTitleAttr = AstNodeInfo.hasAttribute(node, 'title');
          let titleAttr, titleAttrValue;
          if (hasTitleAttr) {
            titleAttr = AstNodeInfo.findAttribute(node, 'title');
            if (titleAttr.value.type === 'TextNode') {
              titleAttrValue = titleAttr.value.chars;
            } else {
              titleAttrValue = titleAttr.value;
            }
          }

          let hasTitleArg = AstNodeInfo.hasAttribute(node, '@title');
          let titleArg, titleArgValue;
          if (hasTitleArg) {
            titleArg = AstNodeInfo.findAttribute(node, '@title');
            if (titleArg.value.type === 'TextNode') {
              titleArgValue = titleArg.value.chars;
            } else {
              titleArgValue = titleArg.value;
            }
          }

          let titleValues = [titleAttrValue, node.tag === 'LinkTo' && titleArgValue]
            .filter((possibleValue) => typeof possibleValue === 'string')
            .map((value) => value.toLowerCase().trim());

          if (titleValues.length > 1) {
            this.log({
              message:
                'Specifying title as both an attribute and an argument to <LinkTo /> is invalid.',
              node,
            });
          }

          if (hasInvalidLinkTitle(node, titleValues)) {
            this.log({
              message: 'Title attribute values should not be the same as or part of the link text.',
              node,
            });
          }
        }
      },
      BlockStatement(node) {
        if (node.path.original === 'link-to') {
          let titleHashArg = node.hash.pairs.find((pair) => pair.key === 'title');
          if (titleHashArg && titleHashArg.value.type === 'StringLiteral') {
            let titleValue = titleHashArg.value.value.toLowerCase().trim();

            if (hasInvalidLinkTitle(node, [titleValue])) {
              this.log({
                message:
                  'Title attribute values should not be the same as or part of the link text.',
                node,
              });
            }
          }
        }
      },
    };
  }
}
