# require-valid-svg

TODO: context about the problem goes here

TODO: what the rule does goes here

## Examples

This rule **forbids** the following:

```hbs
<svg role="image">...</svg>
```

```hbs
<svg role="image" alt="">...</svg>
```

```hbs
<svg role="image" alt="meaningful alt text">...</svg>
```

```hbs
<svg role="image">
  <title>Meaningful title</title>
  ...
</svg>
```

This rule **allows** the following:

```hbs
<svg role="image" alt="meaningful alt text goes here">
  <title>Meaningful Title text because screen reader implementation support is spotty</title>
  ...
</svg>
```

```hbs
<a href="link.html" aria-label="home page">
  <svg aria-hidden="true">...</svg>
</a>
```

```hbs
<button aria-label="sort ascending to descending">
  <svg aria-hidden="true">...</svg>
</button>
```

## References

- All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, with few exceptions. See: [WCAG 1.1.1 - Non-text Content](https://www.w3.org/TR/WCAG21/#non-text-content)
