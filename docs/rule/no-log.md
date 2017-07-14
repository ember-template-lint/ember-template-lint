## no-log

`{{log}}` will produce messages in the browser console. That is undesirable in a production environment.

This rule forbids usage of the following:

```hbs
{{log}}
{{log "foo" var}}
```
