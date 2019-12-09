## no-invalid-role

This rule checks for invalid element/role combinations.

Current list of checks:

1. Use of the presentation role for content which should convey semantic information may prevent the user from understanding that content. This rule checks semantic HTML elements for the presence of `role="none"` or `role="presentation"` and compares it to the list of disallowed elements. It should not effect custom elements.

### Examples

This rule **forbids** the following:

```hbs
<table role="presentation">
</table>
```

```hbs
<ul role="none">
</ul>
```

This rule **allows** the following:

```hbs
<img role="presentation">
```

```hbs
<span role="none"></span>
```

### Migration

* If violations are found, remediation should be planned to replace the semantic HTML with the `div` element. Additional CSS will likely be required.

### References

* [HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
* [WAI-ARIA presentation(role)](https://www.w3.org/TR/wai-aria/#presentation)
* [Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information](https://www.w3.org/WAI/WCAG21/Techniques/failures/F92)
