# no-invalid-aria-attributes

This rule checks for the use of invalid ARIA attributes, or any aria-\* property on an element that is not included in the [WAI-ARIA States and Properties spec](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties).

## Examples

This rule **forbids** the following:

```hbs
<input type="text" aria-require="true" />
```

This rule **allows** the following:

```hbs
<input type="text" aria-required="true" />
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

