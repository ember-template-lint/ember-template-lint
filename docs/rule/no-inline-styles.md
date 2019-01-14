## no-inline-styles

Inline styles are not the best practice because they are hard to maintain and usually make the overall size of the project bigger. This rule forbids inline styles. Use CSS classes instead.

This rule **forbids** the following:

```hbs
<div style="width:900px"></div>
```

This rule **allows** the following:

```hbs
<div class="wide-element"></div>
```

### Related Rules

* [style-concatenation](style-concatenation.md)
