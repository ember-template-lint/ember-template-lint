# no-element-args

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Passing named arguments to HTML elements causes Ember to fail to render your application. Typically, these are added by accident when
you actually mean to pass an attribute to the element.

This rule forbids passing named arguments to HTML elements.

## Examples

This rule **forbids** the following:

```hbs
<a @href="https://example.com">example.com</a>
```

This rule **allows** the following:

```hbs
<a href="https://example.com">example.com</a>
```

```hbs
<LinkTo @route="my-route">My Route</LinkTo>
```

## References

* [Documentation](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/) for component arguments and HTML attributes
