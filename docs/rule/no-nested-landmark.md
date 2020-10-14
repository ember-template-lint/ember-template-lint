# no-nested-landmark

Landmark elements should not be nested within landmark elements of the same name.

## List of elements & their corresponding roles

- header (banner)
- main (main)
- aside (complementary)
- form (form, search)
- main (main)
- nav (navigation)
- footer (contentinfo)

## Examples

This rule **forbids** the following:

```hbs
<main>
  <main></main>
</main>
```

```hbs
<main>
  <div>
    <main></main>
  </div>
</main>
```

```hbs
<div role="main">
  <main></main>
</div>
```

```hbs
<div role="main">
  <div>
    <main></main>
  </div>
</div>
```

```hbs
<main>
  <div role="main"></div>
</main>
```

```hbs
<main>
  <div>
    <div role="main"></div>
  </div>
</main>
```

```hbs
<header>
  {{! the "header" tag is equivalent to the "banner" role }}
  <div role="banner"></div>
</header>
```

This rule **allows** the following:

```hbs
<div><main></main></div>
```

```hbs
<main></main>
```

```hbs
<div role="application">
  <div role="document">
    <div role="application"></div>
  </div>
</div>
```

```hbs
<header>
  <nav>
  </nav>
</header>
```

## References

- [HTML Sectioning Elements](https://www.w3.org/TR/wai-aria-practices-1.1/#html-sectioning-elements)
- [Landmark Roles](https://www.w3.org/TR/wai-aria-1.1/#landmark_roles)
