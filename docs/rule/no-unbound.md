# no-unbound

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

`{{unbound}}` is a legacy hold over from the days in which Ember's template engine was less performant. Its use today
is vestigial, and it no longer offers performance benefits.

It is also a poor practice to use it for rendering only the initial value of a property that may later change.

## Examples

This rule **forbids** the following:

```hbs
{{unbound aVar}}
```

```hbs
{{some-component foo=(unbound aVar)}}
```

## References

* [deprecations/unbound block syntax](https://deprecations.emberjs.com/v1.x/#toc_block-and-multi-argument-unbound-helper)
* [Ember api/unbound helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=unbound)
