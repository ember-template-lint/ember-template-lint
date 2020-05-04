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
