# no-restricted-invocations

Disallow certain components or helpers from being used.

Use cases include:

* You bring in some addon like ember-composable-helpers, but your team deems one or many of the helpers not suitable and wants to guard against their usage
* You want to discourage use of a deprecated component

## Examples

Given a config of:

```js
'no-restricted-invocations': ['foo-bar']
```

This rule **forbids** the following:

```hbs
{{foo-bar}}
```

```hbs
{{#foo-bar}}{{/foo-bar}}
```

```hbs
<FooBar />
```

## Configuration

One of these:

* string[] - helpers or components to disallow (using kebab-case names like `nested-scope/component-name`)
* object[] - with the following keys:
  * `names` - string[] - helpers or components to disallow (using kebab-case names like `nested-scope/component-name`)
  * `message` - string - custom error message to report for violations (typically a deprecation notice / explanation of why not to use it and a recommended replacement)

## Related Rules

* [ember/no-restricted-service-injections](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-restricted-service-injections.md)
