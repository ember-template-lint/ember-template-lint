# no-invalid-aria-attributes

ARIA attributes are used to provide an element with specific accessibility functions. An ARIA attribute is invalid if it is either misspelled or does not currently exist in the [WAI-ARIA States and Properties spec](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties). An invalid ARIA attribute performs no function, and the element it belongs to remains inaccessible.

This rule disallows the use of invalid ARIA attributes.

## Examples

This rule **forbids** the following:

```hbs
<input type="text" aria-not-real="true" />
```

This rule **allows** the following:

```hbs
<input type="text" aria-required="true" />
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
