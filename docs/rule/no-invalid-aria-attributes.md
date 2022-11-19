# no-invalid-aria-attributes

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

ARIA attributes are used to provide an element with specific accessibility functions. An ARIA attribute is invalid if its name or values are either misspelled or do not currently exist in the [WAI-ARIA States and Properties spec](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties).

This rule disallows the use of invalid ARIA attributes.

## Examples

This rule **forbids** the following:

```hbs
<input type="text" aria-not-real="true" />
<div role="region" aria-live="bogus">Inaccessible live region</div>',
<button type="submit" disabled="true" aria-disabled="123">Submit</button>
```

This rule **allows** the following:

```hbs
<input type="text" aria-required="true" />
<div role="region" aria-live="polite">Accessible live region</div>',
<button type="submit" aria-invalid={{if this.hasNoSpellingErrors "false" "spelling"}}>Send now</button>
```

## References

- [Using ARIA, Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
