# no-heading-inside-button

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Assistive technology allows users to browse a page by heading elements (`<h1>` - `<h6>`). However, if those heading elements are nested inside of button elements, they will automatically be marked as presentational by browsers. Any HTML element where ["children presentational" is true](https://w3c.github.io/aria/#button) should be coerced by the browser to be presentational, and therefore not included in the accessibility tree.

As such, nesting a heading element inside of a button element will cause failures for WCAG requirement 1.3.1, Info and Relationships, because the heading has lost semantic meaning.

This rule checks `<button>` elements to see if they contain heading (`<h1>` - `<h6>`) elements, and gives an error message if they are found.

## Examples

This rule **forbids** the following:

```hbs
<button><h1>Some Text</h1></button>
```

This rule **allows** the following:

```hbs
<button><span>Button Text</span></button>
```

## Migration

* Replace `<h1>` - `<h6>` elements inside of `<button>` elements with classes that reflect the desired styling.

## References

* <https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html>
* <https://w3c.github.io/aria/#button>
