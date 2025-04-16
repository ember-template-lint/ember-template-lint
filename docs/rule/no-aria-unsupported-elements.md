# no-aria-unsupported-elements

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Certain reserved DOM elements do not support ARIA roles, states and properties. This is often because they are not visible.

These elements include:

- `html`
- `meta`
- `script`
- `style`

This rule enforces that these DOM elements do not contain the `role` and/or `aria-*` props.

## Examples

This rule **forbids** the following:

```hbs
<meta charset="UTF-8" aria-hidden="false" />
```

```hbs
<html lang="en" role="application"></html>
```

```hbs
<script aria-hidden="false"></script>
```

This rule **allows** the following:

```hbs
<meta charset="UTF-8" />
```

```hbs
<html lang="en"></html>
```

```hbs
<script></script>
```

## References

- [Understanding Success Criterion 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- [aria-unsupported-elements - eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-unsupported-elements.md)
