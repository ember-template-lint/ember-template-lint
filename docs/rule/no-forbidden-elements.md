# no-forbidden-elements

This rule disallows the use of forbidden elements in template files.

The rule is configurable so teams can add their own disallowed elements.
The default list of forbidden elements are `meta`, `style`, `html` and `script`.

## Examples

This rule **forbids** the following:

```hbs
<script></script>
```

```hbs
<style></style>
```

```hbs
<html></html>
```

```hbs
<meta charset="utf-8">
```

This rule **allows** the following:

```hbs
<header></header>
```

```hbs
<div></div>
```

## Configuration

* boolean - `true` to enable / `false` to disable
  * array -- an array of strings to forbid, default: ['meta', 'style', 'html', 'style']
  * object -- An object with the following keys:
    * `forbidden` -- An array of forbidden element names

## References

* [Ember guides/template restrictions](https://guides.emberjs.com/release/components/#toc_restrictions)
