# no-aria-hidden-body

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

The aria-hidden attribute should never be present on the `<body>` element, as it hides the entire document from assistive technology.

## Examples

This rule **forbids** the following:

```hbs
<body aria-hidden>
```

```hbs
<body aria-hidden="true">
```

This rule **allows** the following:

```hbs
<body>
```

## References

* [WCAG 4.1.2 - Name, Role, Value (Level A)](https://www.w3.org/TR/WCAG21/#name-role-value)
