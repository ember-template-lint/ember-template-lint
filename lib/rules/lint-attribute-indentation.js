'use strict';

const Rule = require('./base');

const getWhiteSpaceLength = function(statement) {
  let whiteSpace = statement.match(/^\s+/) || [];
  return (whiteSpace[0] || '').length;
};

const canApplyRule = function(node, type, config) {
  let end;
  let start = node.loc.start;

  if (type === 'MustacheStatement') {
    end = node.loc.end;
  } else {
    /*
      For a block statement, the start of the program block is the end of the open invocation.

      {{#contact-details firstName=firstName lastName=lastName as |contact|}}
        {{contact.fullName}}
      {{/contact-details}}
    */

    end = node.program.loc.start;
  }

  if (start.line === end.line) {
    return (end.column - start.column)  > config;
  }

  return true;
};


module.exports = class AttributeSpacing extends Rule {

  getBlockParamStartLoc(node) {
    let actual, expected;
    let programStartLoc = node.program.loc.start;
    let nodeStart = node.loc.start;
    if (node.params.length === 0 && node.hash.pairs.length === 0) {
      expected = {
        line: nodeStart.line + 1,
        column: nodeStart.column
      };
      if (nodeStart.line === programStartLoc.line) {
        let displayName = `{{#${node.path.original}`;
        /*
        {{#employee-details as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        actual = {
          line: nodeStart.line,
          column: displayName.length
        };
      } else {
        /*
        {{#employee-details
          as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        let source = this.sourceForNode({
          loc: {
            start: {
              line: programStartLoc.line,
              /*
                Setting column as 0, to get the entire line for calculating the start column.
                For instance, the below will result in `                    as |employee|}}` => 19
                  `{{#employee-details
                                      as |employee|}}
                    {{employee.name}}
                  {{/employee-details}}
                  `
              */
              column: 0
            },
            end: programStartLoc
          }
        });
        //
        /*
          Determining the actual column by calculating the whitespace length
            `{{#employee-details
                                as |employee|}} => 19
              {{employee.name}}
            {{/employee-details}}`
        */
        actual = {
          line: programStartLoc.line,
          column: getWhiteSpaceLength(source)
        };
      }

    } else {
      let paramOrHashPairEndLoc;

      if (node.params.length) {
        /*
        The block form may contain only positional params as below
        {{#employee-details
          firstName
          lastName
          age
        as |employee|}}
          {{employee.fullName}}
        {{/employee-details}}
        */
        paramOrHashPairEndLoc = node.params[node.params.length - 1].loc.end;
      }

      if (node.hash.pairs.length) {
        /*
        The block form may contain only named params as below
        {{#employee-details
          firstName=firstName
          lastName=lastName
          age=age
        as |employee|}}
          {{employee.fullName}}
        {{/employee-details}}
        */
        paramOrHashPairEndLoc = node.hash.loc.end;
      }

      expected = {
        line: paramOrHashPairEndLoc.line + 1,
        column: node.loc.start.column
      };
      if (paramOrHashPairEndLoc.line === programStartLoc.line) {
        /*
        {{#employee-details
          employeeId=employeeId as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        actual = paramOrHashPairEndLoc;
      } else if (paramOrHashPairEndLoc.line < programStartLoc.line) {
        /*
        {{#employee-details
          employeeId=employeeId
        as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */

        /*
        Since the below scenario is possible, we are getting the source of params/hash pair line.

        {{#employee-details
          id=id as |employee
          address|}}
          {{employee.name}}
        {{/employee-details}}
        */

        let loc = {
          start: paramOrHashPairEndLoc,
          end: {
            line: paramOrHashPairEndLoc.line
          }
        };

        let hashPairLineEndSource = this.sourceForNode({ loc }).trim();

        if (hashPairLineEndSource) {
          /*
          {{#employee-details
            id=id as |employee
            address|}}
            {{employee.name}}
          {{/employee-details}}
          */
          actual = paramOrHashPairEndLoc;
        } else {
          /*
          {{#employee-details
            id=id
                  as |employee address|}}
            {{employee.name}}
          {{/employee-details}}
          */
          actual = {
            line: programStartLoc.line,
            column: getWhiteSpaceLength(this.source[programStartLoc.line - 1])
          };
        }
      }
    }
    return {
      actual,
      expected
    };
  }


  validateBlockParams(node) {
    /*
      Validates alignment of the block params.

      {{#employee-details
        employeeId=employeeId
      as |name age address|}}
        {{name}}, {{age}}, {{address}}
      {{/employee-details}}
    */

    let location = this.getBlockParamStartLoc(node);
    let actual = location.actual;
    let expected = location.expected;

    if (actual.line !== expected.line ||
      actual.column !== expected.column) {

      let blockParamStatement = this.sourceForNode({ loc: { start: actual, end: node.program.loc.start } }).trim();

      let message = `Incorrect indentation of block params '${blockParamStatement}' beginning at L${actual.line}:C${actual.column}. Expecting the block params to be at L${expected.line}:C${expected.column} with an indentation of ${expected.column} but was found at ${actual.column}.`;

      this.log({
        message,
        line: actual.line,
        column: actual.column,
        source: this.sourceForNode(node)
      });
    }
  }

  iterateParams(params, type, expectedLineStart, expectedColumnStart, node) {
    let paramType, namePath;

    if (type === 'positional') {
      paramType = 'positional param';
      namePath = 'original';
    } else {
      paramType = 'attribute';
      namePath = 'key';
    }
    params.forEach((param) => {
      let actualStartLocation = param.loc.start;
      if (expectedLineStart !== actualStartLocation.line ||
        expectedColumnStart !== actualStartLocation.column) {
        let paramName = param[namePath];
        let message = `Incorrect indentation of ${paramType} '${paramName}' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '${paramName}' to be indentation at an of ${expectedColumnStart} but was found at ${actualStartLocation.column}`;
        this.log({
          message,
          line: actualStartLocation.line,
          column: actualStartLocation.column,
          source: this.sourceForNode(node)
        });
      }
      expectedLineStart++;
    });
  }

  validateParamsAndHashPairs (node) {
    /*
        Validates both the positional and named params for both block and non-block form.

        {{contact-details
          age
          firstName=firstName
          fullName=fullName
        }}
    */
    let expectedColumnStart = node.loc.start.column + 2; //params should be after 2 positions from component start node
    let expectedLineStart = node.loc.start.line + 1;

    this.iterateParams(node.params, 'positional', expectedLineStart, expectedColumnStart, node);
    this.iterateParams(node.hash.pairs, 'attribute', expectedLineStart + node.params.length, expectedLineStart, node);
  }

  validateCloseBrace(node) {
    /*
      Validates the close brace (`}}`) of the non-block form.
    */
    let actualStartLocation = {
      line: node.loc.end.line,
      column: node.loc.end.column - 2
    };
    let expectedStartLocation = {
      line: node.hash.loc.end.line + 1,
      column: node.loc.start.column
    };
    let componentName = node.path.original;
    if (actualStartLocation.line !== expectedStartLocation.line ||
      actualStartLocation.column !== expectedStartLocation.column) {
      let message = `Incorrect indentation of close curly braces '}}' for the component '{{${componentName}}}' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected to be indentation at L${expectedStartLocation.line}:C${expectedStartLocation.column} with an of ${expectedStartLocation.column} but was found at ${actualStartLocation.column}`;

      this.log({
        message,
        line: actualStartLocation.line,
        column: actualStartLocation.column,
        source: this.sourceForNode(node)
      });
    }

  }

  validateNonBlockForm(node) {
    // no need to validate if no positional and named params are present.
    if (node.params.length || node.hash.pairs.length) {
      this.validateParamsAndHashPairs(node);
      this.validateCloseBrace(node);
    }
  }

  validateBlockForm(node) {
    if (node.params.length || node.hash.pairs.length) {
      this.validateParamsAndHashPairs(node);
    }
    if (node.program.blockParams && node.program.blockParams.length) {
      this.validateBlockParams(node);
    }
  }

  parseConfig(config) {
    let configType = typeof config;
    let errorMessage = 'The attribute-indentation rule accepts one of the following values.\n ' +
      '  * boolean - `true` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.\n' +
      '  * { open-invocation-max-len: n characters } - The max length of the opening invocation can be configured.\n' +
      '\nYou specified `' + config + '`';

    switch (configType) {
    case 'boolean':
      return config ? 80 : false;
    case 'object':
      if (isNaN(config['open-invocation-max-len'])) {
        throw new Error(errorMessage);
      }
      return config['open-invocation-max-len'];
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  }

  visitor() {

    return {
      BlockStatement (node) {
        if (canApplyRule(node, 'BlockStatement', this.config)) {
          this.validateBlockForm(node);
        }
      },

      MustacheStatement(node) {
        if (canApplyRule(node, 'MustacheStatement', this.config)) {
          this.validateNonBlockForm(node);
        }
      }
    };
  }
};
