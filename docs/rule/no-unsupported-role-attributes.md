# no-unsupported-role-attributes

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Many ARIA states and properties are only available to elements with particular roles. This ensures that the appropriate information gets exposed to a browser's accessibility API for the given element.

This rule disallows the use of ARIA properties unsupported by an element's defined role. An element's role may either be explicitly set by the `role` attribute, or it may be implicitly defined through the use of HTML elements with inherent roles. For example, `<input type="checkbox"` has the implicit role of `checkbox`.

## Examples

This rule **forbids** the following:

```hbs
<div role="link" href="#" aria-checked />
<input type="checkbox" aria-invalid="grammar" />
<CustomComponent role="listbox" aria-level="2" />
```

This rule **allows** the following:

```hbs
<div role="heading" aria-level="1" />
<input type="image" aria-atomic />
<CustomComponent role="textbox" aria-required="true" />
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
