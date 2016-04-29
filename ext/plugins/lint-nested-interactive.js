'use strict';

/*
 Disallows nested of interactive elements

 ```
 {{! good }}
 <button>Click here</button> <a href="/">and a link</a>

 {{! bad}}
 <button>Click here <a href="/">and a link</a></button>
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var LogNestedInteractive = buildPlugin(addonContext, 'nested-interactive');

  function isElementNode(node) {
    return node.type === 'ElementNode';
  }

  LogNestedInteractive.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The nested-interactive rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable / `false` to disable\n' +
          '  * array -- an array of strings to whitelist\n' +
          '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      return config;
    case 'object':
      if (Array.isArray(config)) {
        return config;
      } else {
        throw new Error(errorMessage);
      }
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  };

  LogNestedInteractive.prototype.getConfigWhiteList = function() {
    if (Array.isArray(this.config)) {
      return this.config;
    } else {
      return [
        'a',
        'button',
        'details',
        'embed',
        'iframe',
        'img',
        'input',
        'object',
        'select',
        'tabindex',
        'textarea'
      ];
    }
  };

  LogNestedInteractive.prototype.detect = function(node) {
    return node.type === 'Program';
  };

  LogNestedInteractive.prototype.process = function(node) {
    var whitelistTests = this.getConfigWhiteList();

    node.body
      .filter(isElementNode)
      .forEach(function(node) {
        this.findNestedInteractiveElements(node, null, whitelistTests);
      }, this);
  };

  LogNestedInteractive.prototype.hasNodeHaveAttribute = function(node, attributeName) {
    return node.attributes.some(function(attribute) {
      return attribute.name === attributeName;
    });
  };

  LogNestedInteractive.prototype.isNodeLink = function(node, whitelistTests) {
    return (
      whitelistTests.indexOf('a') !== -1 &&
      node.tag === 'a' && this.hasNodeHaveAttribute(node, 'href')
    );
  };

  LogNestedInteractive.prototype.isNodeNotHiddenInput = function(node, whitelistTests) {
    if (whitelistTests.indexOf('input') === -1) {
      return false;
    }

    if (node.tag === 'input') {
      var isInputTypeHidden = node.attributes.some(function(attribute) {
        return (
          attribute.name === 'type' &&
          attribute.value &&
          attribute.value.chars === 'hidden'
        );
      });

      // NOTE: `!`
      if (!isInputTypeHidden) {
        return true;
      }
    }

    return false;
  };

  LogNestedInteractive.prototype.hasNodeHaveTabIndex = function(node, whitelistTests) {
    return (
      whitelistTests.indexOf('tabindex') !== -1 &&
      this.hasNodeHaveAttribute(node, 'tabindex')
    );
  };

  LogNestedInteractive.prototype.isNodeUseMapInteractive = function(node, whitelistTests) {
    return (
      whitelistTests.indexOf(node.tag) !== -1 &&
      (node.tag === 'img' || node.tag === 'object') &&
      this.hasNodeHaveAttribute(node, 'usemap')
    );
  };

  LogNestedInteractive.prototype.isNodeInteractiveTag = function(node, whitelistTests) {
    var interactiveTags = [
      'button',
      'details',
      'embed',
      'iframe',
      'select',
      'textarea'
    ];

    return interactiveTags.some(function(tagName) {
      return whitelistTests.indexOf(tagName) !== -1 && tagName === node.tag;
    });
  };

  /**
   * NOTE: `<label>` was omitted due to the ability nesting a label with an input tag.
   * NOTE: `<audio>` and `<video>` also omitted because use legacy browser support
   * there is a need to use it nested with `<object>` and `<a>`
   */
  LogNestedInteractive.prototype.isInteractiveElement = function(node, whitelistTests) {
    if (!node) {
      return false;
    }

    if (this.isNodeInteractiveTag(node, whitelistTests)) {
      return true;
    }

    if (this.isNodeLink(node, whitelistTests)) {
      return true;
    }

    if (this.isNodeNotHiddenInput(node, whitelistTests)) {
      return true;
    }

    if (this.hasNodeHaveTabIndex(node, whitelistTests)) {
      return true;
    }

    if (this.isNodeUseMapInteractive(node, whitelistTests)) {
      return true;
    }

    return false;
  };


  LogNestedInteractive.prototype.getLogMessage = function(node, parentNode) {
    var isParentHasTabIndexAttribute = this.hasNodeHaveAttribute(parentNode, 'tabindex');
    var isParentHasUseMapAttribute = this.hasNodeHaveAttribute(parentNode, 'usemap');
    var parentNodeError = '<' + parentNode.tag + '>';

    if (isParentHasTabIndexAttribute) {
      parentNodeError = 'an element with attribute `tabindex`';
    } else if (isParentHasUseMapAttribute) {
      parentNodeError = 'an element with attribute `usemap`';
    }

    var isChildHasTabIndexAttribute = this.hasNodeHaveAttribute(node, 'tabindex');
    var isChildHasUseMapAttribute = this.hasNodeHaveAttribute(node, 'usemap');
    var childNodeError = '<' + node.tag + '>';

    if (isChildHasTabIndexAttribute) {
      childNodeError = 'an element with attribute `tabindex`';
    } else if (isChildHasUseMapAttribute) {
      childNodeError = 'an element with attribute `usemap`';
    }

    return 'Do not use ' + childNodeError + ' inside ' + parentNodeError;
  };

  LogNestedInteractive.prototype.findNestedInteractiveElements = function(node, parentInteractiveNode, whitelistTests) {
    if (this.isInteractiveElement(parentInteractiveNode, whitelistTests)) {
      if (this.isInteractiveElement(node, whitelistTests)) {
        this.log({
          message: this.getLogMessage(node, parentInteractiveNode),
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node)
        });

        return;
      }
    }

    node.children
      .filter(isElementNode)
      .forEach(function(childNode) {
        this.findNestedInteractiveElements(childNode, node, whitelistTests);
      }, this);
  };

  return LogNestedInteractive;
};
