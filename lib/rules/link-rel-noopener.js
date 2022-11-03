import { builders } from 'ember-template-recast';

import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

/**
 Disallow usage of `<a target="_blank">` without an `rel="noopener"` attribute.

 Good:

 ```
 <a href="/some/where" target="_blank" rel="noopener"></a>
 ```

 Bad:

 ```
 <a href="/some/where" target="_blank"></a>
 ```
 */

const CONFIG = {
  regexp: /(.*\s)?noopener\s(.*\s)?noreferrer(\s.*)?|(.*\s)?noreferrer\s(.*\s)?noopener(\s.*)?/,
  message: 'links with target="_blank" must have rel="noopener noreferrer"',
};

export default class LinkRelNoopener extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? CONFIG : false;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      ['  * boolean - `true` to enable / `false` to disable'],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementNode(node) {
        let isLink = node.tag === 'a';
        if (!isLink) {
          return;
        }

        let targetBlank = hasTargetBlank(node);
        if (!targetBlank) {
          return;
        }

        let relNoopener = hasRelNoopener(node, this.config.regexp);
        if (relNoopener) {
          return;
        }

        if (this.mode === 'fix' && isFixable(node)) {
          return fix(node);
        }

        this.log({
          isFixable: isFixable(node),
          message: this.config.message,
          node,
        });
      },
    };
  }
}

function isFixable(elementNode) {
  let oldRel = AstNodeInfo.findAttribute(elementNode, 'rel');
  return !oldRel || oldRel.value.type === 'TextNode';
}

function fix(node) {
  let oldRel = AstNodeInfo.findAttribute(node, 'rel');

  let oldRelValue =
    oldRel && oldRel.value.type === 'TextNode'
      ? // normalize whitespace between values
        oldRel.value.chars.trim().replace(/\s+/g, '')
      : '';

  // remove existing instances of noopener/noreferrer so we can add them back in
  // the order the rule suggests in the error message
  let newRelValue = oldRelValue.replace(/(noopener|noreferrer)/g, '');
  newRelValue = `${newRelValue} noopener noreferrer`;

  let oldRelIndex = oldRel ? node.attributes.indexOf(oldRel) : null;
  let newRelNode = builders.attr('rel', builders.text(newRelValue.trim()));

  if (oldRel) {
    node.attributes.splice(oldRelIndex, 1, newRelNode);
  } else {
    node.attributes.push(newRelNode);
  }
}

function hasTargetBlank(node) {
  let targetAttribute = AstNodeInfo.findAttribute(node, 'target');
  if (!targetAttribute) {
    return false;
  }

  switch (targetAttribute.value.type) {
    case 'TextNode': {
      return targetAttribute.value.chars === '_blank';
    }
    default: {
      return false;
    }
  }
}

function hasRelNoopener(node, regexp) {
  let relAttribute = AstNodeInfo.findAttribute(node, 'rel');
  if (!relAttribute) {
    return false;
  }

  switch (relAttribute.value.type) {
    case 'TextNode': {
      return regexp.test(relAttribute.value.chars);
    }
    default: {
      return false;
    }
  }
}
