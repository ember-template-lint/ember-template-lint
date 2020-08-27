# no-duplicate-attributes

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule forbids multiple attributes passed to a Component, Helper, or an ElementNode with the same name. According to the [HTML attributes Spec](https://html.spec.whatwg.org/multipage/syntax.html#attributes-2):

> There must never be two or more attributes on the same start tag whose names are an ASCII case-insensitive match for each other.

## Examples

This rule **forbids** the following:

```hbs
{{employee-details name=name age=age name=name}}
```

This rule **allows** the following:

```hbs
{{employee-details name=name age=age}}
```

## References

* [HTML attributes spec](https://html.spec.whatwg.org/multipage/syntax.html#attributes-2)
