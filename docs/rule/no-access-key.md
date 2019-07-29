## no-access-key

### `<* accessKey>`

Enforce no accessKey prop on element. Access keys are HTML attributes that allow web developers to assign keyboard shortcuts to elements. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

This rule takes no arguments.

This rule **allows** the following:

```hbs
<div></div>
```

This rule **forbids** the following:

```hbs
<div accessKey="h" ></div>
```

### References
1. [WebAIM](http://webaim.org/techniques/keyboard/accesskey#spec)
