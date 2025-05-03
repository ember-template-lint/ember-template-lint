# no-accesskey-attribute

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Enforce no accesskey prop on element. Access keys are HTML attributes that allow web developers to assign keyboard shortcuts to elements. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

This rule takes no arguments.

## Examples

This rule **allows** the following:

```hbs
<div></div>
```

This rule **forbids** the following:

```hbs
<div accesskey="h"></div>
```

## References

* [WebAIM](http://webaim.org/techniques/keyboard/accesskey#spec)
* [WCAG: Understanding Character Key Shortcut](https://w3c.github.io/wcag/understanding/character-key-shortcuts.html)
* [W3C Wiki: Accesskey](https://www.w3.org/WAI/PF/HTML/wiki/Accesskey)
