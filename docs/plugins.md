# Plugin Support

You can customize the linter with rules that are more specific to your use case with the `ember-template-lint` plugin system.

Plugins can define new rules and set up default configurations that can be extended.

## Defining plugin objects

Each plugin object can include these properties.

* `name` -- `string` (required)

  The name of the plugin. Will be used to namespace any configuration objects.

* `rules` -- `Object`

  Object that defines new rules.
  Each key represents the name of the rule that is defined.
  Each value should be a Rule object. See [Rule APIs](#rule-apis) for more detail.

* `configurations` -- `Object`

  Object that defines new configurations that can be extended.
  Each key represents the name of the configuration object.
  Each value should be a configuration object, that can include the [same properties as the base config object](./configuration.md#configuration-properties) in any `.template-lintrc.js` -- i.e. `rules`, `extends`, `ignore`, etc.

Sample plugin object:

```javascript
import disallowInlineComponents from './lib/template-lint-rules/disallow-inline-components.js';
import anotherCustomRule from './lib/template-lint-rules/another-custom-rule.js';

export default {
  // Name of plugin
  name: 'my-plugin',

  // Define rules for this plugin. Each path should map to a plugin rule
  rules: {
    'disallow-inline-components': disallowInlineComponents,
    'another-custom-rule': anotherCustomRule
  },

  // Define configurations for this plugin that can be extended by the base configuration
  configurations: {
    'no-inline': {
      rules: {
        'disallow-inline-components': true
      }
    }
  }
}
```

Plugins that directly import/export rules must be written in ESM.

## Adding plugins to your configuration

In order to enable a plugin, you must add it to the `plugins` key in your configuration file.

`plugins` accepts an array of either plugin objects or strings to be passed to `require` which resolve to plugin objects.

```javascript
// .template-lintrc.js

module.exports = {
  plugins: [

    // Define a plugin inline
    {
      name: 'inline-plugin',

      ...
    },

    // Define a plugin that is exported elsewhere (i.e. a third-party plugin)
    './plugins/some-local-plugin',
    'some-npm-package/third-party-plugin',
  ],

  extends: [
    // Extend configuration defined in inline plugins
    'configuration-defined-in-my-inline-plugin',

    // Extend configuration defined in plugins in other files
    'some-local-plugin:recommended',
    'third-party-plugin:another-configuration'
  ],

  rules: {
    // Use rules defined in plugins
    'rule-defined-in-my-inline-plugin': true
    'rule-defined-in-some-local-plugin': true
  }
}
```

## Rule APIs

Every rule defined by a plugin can use these public APIs defined by `ember-template-lint`.

### Rule implementation

Each file that defines a rule should export a class that extends from the base rule object. Rules must be written in ESM.

Sample rule:

```javascript
import { Rule } from 'ember-template-lint';

export default class NoEmptyComments extends Rule {
  visitor() {
    return {
      CommentStatement(node) {
        if (node.value.trim() === '') {
          this.log({
            message: 'comments cannot be empty',
            node,
          });
        }
      }
    };
  }
};
```

You can override the following methods on the base plugin class:

* `function visitor(): visitorObject`

  The `visitor` function should return an object that maps Handlebars node types to functions. Whenever the Handlebars parser encounters a particular type of node, any handler function that you define for that node will be called on it. You can reference the [Handlebars Compiler API](https://github.com/wycats/handlebars.js/blob/master/docs/compiler-api.md) for more detail on the types of nodes and their interfaces.

The base rule also has a few helper functions that can be useful in defining rule behavior:

* `function log(options)`

  Report a lint error. The `log` function accepts an Object as its only argument, which can contain the following parameters:
  * `message` -- `string`
    The error message to display.
  * `node` -- `ASTNode`
    The node that the error applies to.
  * `line` -- `number`
    The line number of the error in the source string.
  * `column` -- `number`
    The column number of the error in the source string.
  * `source` -- `string`
    The source string that caused the error.
  * `fix` -- `string`
    An optional string to display with the recommended fix.

* `function sourceForNode(node): string`

  Given a Handlebars AST node, return the string source of that node. Useful to generate `source` when logging errors with `log`.

* `function isLocal(ASTNode): boolean`

  Given an AST node, check if it is derived from a local / block param.

### Rule tests

Here's an example of how to write tests for a rule:

```js
// test/unit/rules/no-negated-condition-test.js

import { generateRuleTests } from 'ember-template-lint';
import plugin from '../../../index.js';

generateRuleTests({
  name: 'no-negated-condition',

  groupMethodBefore: beforeEach,
  groupingMethod: describe,
  testMethod: it,
  plugins: [plugin],

  config: true,

  // Passing test cases:
  good: [
    // Simple string test case:
    '{{#if condition}}<img>{{/if}}',

    // Object test case:
    {
      template: '{{#if condition}}<img>{{/if}}',
      config: {}, // Custom config for this test case.
      meta: { moduleId: 'app/templates/index.hbs' }, // Custom filepath for this test case.
    },
  ],

  // Failing test cases:
  bad: [
    {
      // Jest snapshot test case (recommended):
      template: '{{#if (not condition)}}<img>{{/if}}',
      fixedTemplate: '{{#unless condition}}<img>{{/unless}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Change \`if (not condition)\` to \`unless condition\`.",
              "rule": "no-negated-condition",
              "severity": 2,
              "source": "{{#if (not condition)}}<img>{{/if}}",
            },
          ]
        `);
      },
    },

    {
      // Non-snapshot version of the above test case:
      template: '{{#if (not condition)}}<img>{{/if}}',
      fixedTemplate: '{{#unless condition}}<img>{{/unless}}',

      result: {
        message: 'Some error message...',
        source: '{{#if (not condition)}}<img>{{/if}}',
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
  ],

  // Test cases that we expect to cause the rule to throw an exception (e.g. invalid config).
  error: [
    {
      template: 'test',
      config: { foo: true },
      result: {
        fatal: true,
        message: 'Some exception message...',
      },
    },
  ],
});
```

#### Snapshot tests

The [Jest Snapshot](https://jestjs.io/docs/snapshot-testing) version of `bad` test cases is recommended as it can be easily updated with `jest --updateSnapshot`.

### Helper: `ASTHelpers`

There are a number of helper functions exported by [`ember-template-lint`](../lib/helpers/ast-node-info.js) that can be used with AST nodes in your rule's visitor handlers.

You can access these helpers via:

```js
import { ASTHelpers } from 'ember-template-lint';
```

* `function isConfigurationHtmlComment(node): boolean`

  Returns true if this node is an HTML comment that is meant to set linter configuration (i.e. `<!-- template-lint enabled=false -->`).

* `function isNonConfigurationHtmlComment(node): boolean`

  Returns true if this node is *not* an HTML comment that is meant to set linter configuration.

* `function hasAttribute(node, attributeName): boolean`

  Returns true if this node has an attribute whose name matches `attributeName`.

* `function findAttribute(node, attributeName): Object`

  Returns any attributes on the node with a name that matches `attributeName`.

* `function childrenFor(node): Object[]`

  Returns any child nodes of this node.

* `function hasChildren(node): boolean`

  Returns true if this node has any child nodes.

### Helper: `NodeMatcher`

`ember-template-lint` also exports a `.match` helper that is useful for defining a given rule's 'target nodes' -- that is, the set of nodes for which it is appropriate to apply the rule's logic.

You access this helper via:

```js
import { NodeMatcher } from 'ember-template-lint';
```

* `function match(testNode, ref): boolean`

  Pattern matches a test node against either an individual reference node OR
  an Array of reference nodes.

  ```js
  @param  {Node} testNode - the node to validate
  @param  {Node|Node[]} ref - the reference node(s) to match testNode against
  @return {boolean}
  ```

  An individual comparison returns whether or not the reference node is a
  strict subset of the test node. Similarly, an Array comparison returns
  whether or not any one of its individual reference node elements is a strict
  subset of the test node.

  In this context, the reference(s) can be used as selection criteria that a
  given visited node (test node) must satisfy in order to proceed with rule logic
  execution.

  For simple and specific target patterns, a `match` implementation has clearer
  and more succinct syntax than its conditional (`if`) counterpart because it
  does the following tasks on behalf of the rule:

  * asserts the existence of relevant nodes, properties, values, etc.
  * compounds the 'AND' logic dictated by a strict multi-comparison matching

  As an example, consider a rule designed to ensure that all `div` elements
  with the custom `class` attribute `foo` also have a `role` attribute of
  `textbox`. An outline of the rule might look like:

  Example Target:

  ```html
   <div class="foo"></div>
   ```

  Example Code Context:

  ```js
  // require-textbox-role-on-foo-div.js
   visitor() {
     return ElementNode(node) {
       if (
         // check node against target here
       ) {
         // execute rule logic against target nodes here
       }
     }
   }
  ```

  An implementation using standard AST Node syntax might look like:

  ```js
       if (
         node.tag === 'div' &&
         node.attributes &&
         node.attributes.find((attributeNode) =>
           attributeNode.name === 'class' &&
           attributeNode.value.chars === 'foo'
         ))
       )
  ```

  By comparison, the corresponding `match` implementation might look like:

  ```js
       if (
         NodeMatcher.match(node, {
           tag: 'div',
           attributes: [ { name: 'class', value: { chars: 'foo' } } ]
         })
       )
  ```

  TODO: complex example (multiple supported types of `links`?)

## Discoverability

Add these `keywords` to your plugin's `package.json` file to make it easy for others to find:

* `ember-template-lint`
* `ember-template-lint-plugin`
