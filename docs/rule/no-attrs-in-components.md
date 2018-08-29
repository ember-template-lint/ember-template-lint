## no-attrs-in-components

This rule prevents the usage of `attrs` property to access values passed to the component since all the values can be accessed directly from the template.

For example, doing

```components/templates/layout.hbs
{{attr.foo}}
```
is bad. The correct way would be to directly consume `foo` in the template like,

```components/templates/layout.hbs
{{foo}}
```

or if you using Ember 3.1 and above,

```components/templates/layout.hbs
{{@foo}}
```


The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
