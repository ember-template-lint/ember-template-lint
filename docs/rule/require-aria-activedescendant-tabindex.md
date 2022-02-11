# require-aria-activedescendant-tabindex

This rule requires all non-interactive HTML elements using the `aria-activedescendant` attribute to declare a `tabindex` of zero.

The `aria-activedescendant` attribute identifies the active descendant element of a composite widget, textbox, group, or application with document focus. This attribute is placed on the container element of the input control, and its value is set to the ID of the active child element. This allows screen readers to communicate information about the currently active element as if it has focus, while actual focus of the DOM remains on the container element.

Elements with `aria-activedescendant` must have a `tabindex` of zero in order to support keyboard navigation. Besides interactive elements, which are inherently keyboard-focusable, elements using the `aria-activedescendant` attribute must declare a `tabIndex` of zero with the `tabIndex` attribute.

## Examples

This rule **forbids** the following:

```hbs
<div aria-activedescendant='some-id'></div>
<div aria-activedescendant='some-id' tabindex='-1'></div>
<input aria-activedescendant={{some-id}} tabindex='-1' />
```

This rule **allows** the following:

```hbs
<CustomComponent />
<CustomComponent aria-activedescendant={{some-id}} />
<CustomComponent aria-activedescendant={{some-id}} tabindex={{0}} />
<div aria-activedescendant='some-id' tabindex='0'></div>
<input />
<input aria-activedescendant={{some-id}} />
<input aria-activedescendant={{some-id}} tabindex={{0}} />
```

## References

- [MDN, Using the aria-activedescendant attribute(property)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-activedescendant_attribute)
- [WAI-aria: aria-activedescendant(property](https://www.digitala11y.com/aria-activedescendant-properties/)
- [aria-activedescendant-has-tabindex - eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-activedescendant-has-tabindex.md)
