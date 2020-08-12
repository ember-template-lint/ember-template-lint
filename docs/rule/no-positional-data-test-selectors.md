# no-positional-data-test-selectors

## Motivation

[ember-test-selectors](https://github.com/simplabs/ember-test-selectors) is a very popular library that enables better element selectors for testing.

One of the features that had been added to ember-test-selectors over the years was to allow passing a positional argument to curly component invocations as a shorthand (to avoid having to also add a named argument value).

That would look like:

```hbs
{{some-thing data-test-foo}}
```

Internally, that was converted to an `attributeBinding` for `@ember/component`s. Unfortunately, that particular invocation syntax is in conflict with modern Ember Octane templates. For example, in the snippet above `data-test-foo` is actually referring to `this.data-test-foo` (and would be marked as an error by the `no-implicit-this` rule).

Additionally, the nature of these "fake" local properties significantly confuses the codemods that are used to transition an application into Ember Octane (e.g. [ember-no-implicit-this-codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod) and [ember-angle-brackets-codemod](https://github.com/ember-codemods/ember-angle-brackets-codemod)).

## Examples

This rule forbids the following:

```hbs
{{foo-bar data-test-blah}}
{{#foo-bar data-test-blah}}
{{/foo-bar}}
```

And suggests using the following instead:

```hbs
{{foo-bar data-test-blah=true}}
{{#foo-bar data-test-blah=true}}
{{/foo-bar}}
```

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## References

- [ember-test-selectors#d47f73d](https://github.com/simplabs/ember-test-selectors/commit/d47f73d76b3ccbc9f0be5df3b897afd08b1636a6)
