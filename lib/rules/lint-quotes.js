'use strict';

/*
 Enforce quotes style

 ```
 {{! good }}
 <img alt="tomster" src="tomster.jpg">

 {{! bad}}
 <img alt='tomster' src="tomster.jpg">
 ```

 The following values are valid configuration:

   * boolean -- `false` for disabled. `true` to enforce any qoutes
   * string -- `single` of `double` for enforce style
 */

var buildPlugin = require('./base');

var SINGLE_QUOTES_NAME = 'single';
var DOUBLE_QUOTES_NAME = 'double';

module.exports = function(addonContext) {
  var LogQuotes = buildPlugin(addonContext, 'quotes');

  LogQuotes.prototype.parseConfig = function(config) {
    if (config === false || config === undefined) {
      return false;
    }

    if (config === true) {
      return {
        shouldTestQuoteType: false
      };
    }

    if (config === SINGLE_QUOTES_NAME || config === DOUBLE_QUOTES_NAME) {
      return {
        shouldTestQuoteType: true,
        quotesType: config,
        quoteCharacter: config === SINGLE_QUOTES_NAME ? '\'' : '"'
      };
    }

    var errorMessage = 'The quotes rule accepts one of the following values.\n ' +
      '  * boolean -- `false` to disable\n' +
      '  * string -- `' + SINGLE_QUOTES_NAME + '` of `' + DOUBLE_QUOTES_NAME +'` for enforce style\n' +
      '\nYou specified `' + JSON.stringify(config) + '`';

    throw new Error(errorMessage);
  };

  LogQuotes.prototype.detect = function(node) {
    return (
      node.type === 'ElementNode' &&
      node.attributes.length > 0
    );
  };

  function filterAttribute(attribute) {
    return (
      attribute.value.type === 'TextNode' &&
      attribute.value.chars.length > 0
    );
  }

  LogQuotes.prototype._processAttribute = function(attribute) {
    var source = this.sourceForNode(attribute);
    var qouteCharacter = source[source.length - 1];

    if (!this.config.shouldTestQuoteType) {
      if (qouteCharacter === '"' || qouteCharacter === '\'') {
        return null;
      } else {
        return {
          message: 'Quotes: you should use qoutes for HTML attributes',
          line: attribute.loc.start.line,
          column: attribute.loc.start.column,
          source: source
        };
      }
    }

    if (this.config.quoteCharacter === qouteCharacter) {
      return null;
    }

    var undesiredQouteStyle = (
      this.config.quotesType === SINGLE_QUOTES_NAME ?
        DOUBLE_QUOTES_NAME :
        SINGLE_QUOTES_NAME
    );

    return {
      message: 'Quotes: you got ' + undesiredQouteStyle +
        ' qoutes for an attribute instead of ' + this.config.quotesType +
        ' qoutes',
      line: attribute.loc.start.line,
      column: attribute.loc.start.column,
      source: source
    };
  };

  function filterEmptyErrorMessage(errorMessage) {
    return !!errorMessage;
  }

  LogQuotes.prototype.process = function(node) {
    node.attributes
      .filter(filterAttribute)
      .map(this._processAttribute, this)
      .filter(filterEmptyErrorMessage)
      .map(this.log, this);
  };

  return LogQuotes;
};
