# no-extra-mut-helper-argument

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

A common mistake when using the Ember handlebars template `mut(attr)` helper is to pass an extra `value` parameter to it when only `attr` should be passed. Instead, the `value` should be passed outside of `mut`.

## Examples

This rule **forbids** the following:

```hbs
{{my-component click=(action (mut isClicked true))}}
```

This rule **allows** the following:

```hbs
{{my-component click=(action (mut isClicked) true)}}
```

## Related Rules

* [no-mut-helper](no-mut-helper.md)

## References

* See the [documentation](https://emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut) for the Ember handlebars template `mut` helper
