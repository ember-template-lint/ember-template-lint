## no-input-block

`{{#input}}Some Content{{/input}}` will result in an error during render. This rule
provides a helpful error at build time that otherwise might not be caught quickly at
runtime.

This rule forbids usage of the following:

```hbs
{{#input}}{{/input}}
```
