# no-aria-hidden-body

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

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

* [Using the aria-hidden attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute)
* [How Lighthouse identifies hidden body elements](https://web.dev/aria-hidden-body/)
* [WCAG 4.1.2 - Name, Role, Value (Level A)](https://www.w3.org/TR/WCAG21/#name-role-value)
