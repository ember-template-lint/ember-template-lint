## no-accesskey-attribute

### `<* accesskey>`

Enforce no accesskey prop on element. Access keys are HTML attributes that allow web developers to assign keyboard shortcuts to elements. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

This rule takes no arguments.

This rule **allows** the following:

```hbs
<div></div>
```

This rule **forbids** the following:

```hbs
<div accesskey="h" ></div>
```

### References
1. [WebAIM](http://webaim.org/techniques/keyboard/accesskey#spec)
2. [WCAG: Understanding Character Key Shortcut](https://w3c.github.io/wcag/understanding/character-key-shortcuts.html)
3. [W3C Wiki: Accesskey](https://www.w3.org/WAI/PF/HTML/wiki/Accesskey)
