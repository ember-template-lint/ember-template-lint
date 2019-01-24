## no-positive-tabindex

### `<* tabindex>`

Avoid positive tabIndex property values to synchronize the flow of the page with keyboard tab order.

This rule takes no arguments.

This rule **allows** the following:

```hbs
<span tabindex="0">foo</span>
<span tabindex="-1">bar</span>
<span tabindex={{0}}>baz</span>
```

This rule **forbids** the following:

```hbs
<span tabindex="5">foo</span>
<span tabindex="3">bar</span>
<span tabindex="1">baz</span>
<span tabindex="2">never really sure what goes after baz</span>
```

### References
1. [AX_FOCUS_03](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03)
2. [eslint-plugin-jsx-a11y/tabindex-no-positive](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md)
