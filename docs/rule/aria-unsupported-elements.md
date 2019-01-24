## aria-unsupported-elements


Certain reserved DOM elements do not support ARIA roles, states and properties.
This is often because they are not visible, for example `meta`, `html`, `script`,
`style`. This rule enforces that these DOM elements do not contain the `role` and/or
`aria-*` attributes.


## `<meta | html | script | style>`

This rule **forbids** the following:

```hbs
<meta aria-hidden="false">
```

This rule **allows** the following:

```hbs
<meta>
```

### References

 - Google Audit defs [AX_ARIA_12](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-rules#ax_aria_12)
 - [eslint-plugin-jsx-a11y/aria-unsupported-elements](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md#aria-unsupported-elements)