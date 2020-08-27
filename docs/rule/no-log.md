# no-log

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

`{{log}}` will produce messages in the browser console. That is undesirable in a production environment.

## Examples

This rule **forbids** the following:

```hbs
{{log}}
{{log "foo" var}}
```

## Related rules

* [eslint/no-console](https://eslint.org/docs/rules/no-console)

## References

* [Ember api/log helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/log?anchor=log)
