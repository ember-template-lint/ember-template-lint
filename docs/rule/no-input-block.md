# no-input-block

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Use of the block form of the handlebars `input` helper will result in an error at runtime.

## Examples

This rule **forbids** the following:

```hbs
{{#input}}Some Content{{/input}}
```

This rule **allows** the following:

```hbs
{{input type="text" value=this.firstName disabled=this.entryNotAllowed size="50"}}
```
