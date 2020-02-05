## no-header-inside-button

Assistive technology allows users to browse a page by heading elements (h1-h6). However, if those heading elements are nested inside of button elements, they will be discarded . This can break the WCAG requirement for Info and Relationships (1.3.1) because the heading does not exist for the user with assistive technology.

This rule checks `<button>` elements to see if they contain heading (`<h1>` - `<h6>`) elements, and gives an error message if they are found.

### Examples

This rule **forbids** the following:

```hbs
<button><h1>Some Text</h1></button>
```

This rule **allows** the following:

```hbs
<button><span>Button Text</span></button>
```

### Migration

* Replace h1-h6 elements inside of buttons with classes that reflect the same styling.

### References

* https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html
