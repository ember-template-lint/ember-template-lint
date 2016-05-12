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

   * boolean -- `false` for disabled. `true` to enforce any quotes
   * string -- `single` of `double` for enforce style
 */

var _ = require('lodash');
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

  LogQuotes.prototype._processNode = function(node, source) {
    source = _.isString(source) ? source : this.sourceForNode(node);
    var qouteCharacter = source[source.length - 1];

    if (!this.config.shouldTestQuoteType) {
      if (qouteCharacter === '"' || qouteCharacter === '\'') {
        return;
      } else {
        return this.log({
          message: 'Quotes: you should use quotes for attributes',
          line: node.loc.start.line,
          column: node.loc.start.column,
          source: source
        });
      }
    }

    if (this.config.quoteCharacter === qouteCharacter) {
      return;
    }

    var undesiredQouteStyle = (
      this.config.quotesType === SINGLE_QUOTES_NAME ?
        DOUBLE_QUOTES_NAME :
        SINGLE_QUOTES_NAME
    );

    return this.log({
      message: 'Quotes: you got ' + undesiredQouteStyle +
        ' quotes when you set quotes style to ' + this.config.quotesType +
        ' quotes',
      line: node.loc.start.line,
      column: node.loc.start.column,
      source: source
    });
  };

  LogQuotes.prototype._processAttributeMustacheStatement = function(node) {
    var processNode = _.bind(function(node) {
      switch(node.type) {
      case 'StringLiteral':
        this._processNode(node);
        break;
      case 'SubExpression':
        this._processAttributeMustacheStatement(node);
        break;
      }
    }, this);

    _([])
      .concat(node.params)
      .concat(_.map(node.hash.pairs, _.property('value')))
      .forEach(processNode);
  };

  LogQuotes.prototype._processAttribute = function(attribute) {
    switch(attribute.value.type) {
    case 'TextNode':
      if (attribute.value.chars.length > 0) {
        this._processNode(attribute, this.sourceForNode(attribute));
      }
      break;
    case 'MustacheStatement':
      this._processAttributeMustacheStatement(attribute.value);
      break;
    case 'ConcatStatement':
      /** @todo */
      break;
    }
  };

  LogQuotes.prototype.process = function(node) {
    _.forEach(node.attributes, _.bind(this._processAttribute, this));
  };

  return LogQuotes;
};
