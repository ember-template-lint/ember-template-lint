## img-alt-attributes

An `<img>` without an `alt` attribute is essentially invisible to assistive/accessibility technology (i.e. screen readers).
In order to ensure that screen readers can provide useful information, we need to ensure that all `<img>` elements
have an `alt` attribute specified.

This rule **forbids** the following:

```hbs
<img src="rwjblue.png">
```

This rule **allows** the following:

```hbs
<img src="rwjblue.png" alt="picture of Robert Jackson">
```

### References

* See [WCAG Suggestion H37](https://www.w3.org/TR/WCAG20-TECHS/H37.html)
