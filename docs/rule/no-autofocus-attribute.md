# no-autofocus-attribute

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Enforce no autofocus prop on element. The autofocus attribute is a global attribute that indicates an element should be focused on page load. Because autofocus reduces accessibility by moving users to an element without warning and context, it should not be used.

This rule takes no arguments.

## Examples

This rule **allows** the following:

```hbs
<input />
```

This rule **forbids** the following:

```hbs
<input autofocus />
```

```hbs
<input autofocus='true' />
```

## References

- [MDN Web](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus)
- [Focus Order: Understanding SC 2.4.3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html)
