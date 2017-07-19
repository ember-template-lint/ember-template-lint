## img-alt-attributes

An `<img>` without an `alt` attribute is essentially invisible to assistive technology (i.e. screen readers).
In order to ensure that screen readers can provide useful information, we need to ensure that all `<img>` elements
have an `alt` specified. See [WCAG Suggestion H37](https://www.w3.org/TR/WCAG20-TECHS/H37.html).

The rule forbids the following:

```hbs
<img src="rwjblue.png">
```

Instead, you should write the template as:

```hbs
<img src="rwjblue.png" alt="picture of Robert Jackson">
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
