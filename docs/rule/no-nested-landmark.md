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
<div role="main">
  <main></main>
</div>
```

```hbs
<main>
  <div role="main"></div>
</main>
```

This rule **allows** the following:

```hbs
<div><main></main></div>
```

```hbs
<main></main>
```
