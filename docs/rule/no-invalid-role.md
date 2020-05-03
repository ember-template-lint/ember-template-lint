# no-invalid-role

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

This rule checks for invalid element/role combinations.

Current list of checks:

1. Use of the presentation role for content which should convey semantic information may prevent the user from understanding that content. This rule checks semantic HTML elements for the presence of `role="none"` or `role="presentation"` and compares it to the list of disallowed elements. It should not effect custom elements.

2. Use of invalid role for elements which does not fall under any of the values in this [list](https://www.w3.org/WAI/PF/aria/roles).

## Examples

This rule **forbids** the following:

```hbs
<table role="presentation">
</table>
```

```hbs
<ul role="none">
</ul>
```

```hbs
<div role="accordion"></div>
```

```hbs
<div role="command interface"></div>
```

```hbs
<div role="COMMAND INTERFACE"></div>
```

This rule **allows** the following:

```hbs
<img role="presentation" alt="">
```

```hbs
<span role="none"></span>
```

## Migration

* If violations are found, remediation should be planned to replace the semantic HTML with the `div` element. Additional CSS will likely be required.

## References

* [HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
* [WAI-ARIA presentation(role)](https://www.w3.org/TR/wai-aria/#presentation)
* [Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information](https://www.w3.org/WAI/WCAG21/Techniques/failures/F92)
* [The Role Model](https://www.w3.org/WAI/PF/aria/roles)
