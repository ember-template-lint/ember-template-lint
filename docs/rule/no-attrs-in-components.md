# no-attrs-in-components

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule prevents the usage of `attrs` property to access values passed to the component since all the values can be accessed directly from the template.

## Examples

This rule **forbids** the following:

```hbs
{{attr.foo}}
```

This rule **allows** the following:

```hbs
{{foo}}
```

or if you using Ember 3.1 and above:

```hbs
{{@foo}}
```

## References

* [rfcs/named args](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md#motivation)
