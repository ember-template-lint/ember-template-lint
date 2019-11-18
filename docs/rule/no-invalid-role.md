## no-invalid-role

Use of the presentation role for content which should convey semantic information may prevent the user from understanding that content.

Currently, this rule checks semantic HTML elements for the presence of `role="none"` or `role="presentation"`. Elements that are permitted to explicitly have these role values are `<div>`, `<img>`, `<span>` and `<svg>`.

This rule may be expanded in the future to check for other invalid element/role combinations.

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

* [HTML Semantic Elements](https://html.spec.whatwg.org/#semantics-2)
* [HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
* [WAI-ARIA presentation(role)](https://www.w3.org/TR/wai-aria/#presentation)
* [Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information](https://www.w3.org/WAI/WCAG21/Techniques/failures/F92)
