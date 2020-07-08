# How to add a fixer for a rule

This is a quick guide to help you implement the fix option for a rule.

## Inform the Linter instance that a report is fixable

Reports are made by calling `this.log` in a rule visitor. To inform, the linter
instance that a rule is fixable, update the report with the `isFixable` option
to true.

```js
this.log({
  message,
  line,
  column,
  source,
  isFixable: true, // <-- add this, the linter will do another pass to actually fix the fixable issue
});
```

## Change the rule visitor to actually fix the issue

In the rule context, a `mode` is present. If `this.mode` is equal to `fix`, it
means that the linter is currently running in fix mode.

So, this code:

```js
class MyAwesomeRule extends Rule {
  visitor() {
    return {
      AnyNode(node) {
        this.log({
          message,
          line,
          column,
          source,
          isFixable: true,
        });
      },
    };
  }
}
```

can be transformed to:

```js
const {
  builders: { attr, text },
} = require('ember-template-recast');

class MyAwesomeRule extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (this.mode === 'fix') {
          node.attributes.push(attr('zomg', text('foo'))); // <-- fix the node
        } else {
          this.log({
            message,
            line,
            column,
            source,
            isFixable: true,
          });
        }
      },
    };
  }
}
```

## Update the doc

To mention that the rule has a fixer.

## Update the rule test

To complete the fixer addition, you can update the tests from:

```js
generateRuleTests({
  bad: [
    {
      template,

      result: {
        message,
        source,
        line,
        column,
      },
    },
  ],
});
```

to:

```js
generateRuleTests({
  bad: [
    {
      template,
      fixedTemplate, // <-- add the fixed template

      result: {
        message,
        source,
        line,
        column,
        isFixable: true, // <-- add isFixable: true
      },
    },
  ],
});
```
