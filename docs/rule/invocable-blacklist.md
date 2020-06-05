# invocable-blacklist

Disallow certain components or helpers from being used. Use case is you bring in some addon like ember-composable-helpers, but your team deems one or many of the helpers not suitable and wants to guard against their usage.

## Examples

Given a config of:

```js
'invocable-blacklist': ['foo-bar']
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

* array of strings - helpers or components to blacklist (using kebab-case names like `nested-scope/component-name`)
