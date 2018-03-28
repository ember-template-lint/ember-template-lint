## no-inline-styles

Inline styles are not the best practice because they are hard to maintain and usually make the overall size of the project bigger. This rule forbids the inline styles.

Forbidden:

```hbs
<div style="width:900px"></div>
```

Allowed:

```hbs
<div class="wide-element"></div>
```

This rule is configured with one boolean value:

  * boolean -- `true` for enabled rule that forbids the inline styles / `false` for disabled rule that allows them
