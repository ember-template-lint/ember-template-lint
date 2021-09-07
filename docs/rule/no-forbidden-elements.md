# no-forbidden-elements

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

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

```hbs
<head>
  <meta charset="utf-8">
</head>
```

## Configuration

* boolean - `true` to enable / `false` to disable
  * array -- an array of strings to forbid, default: ['meta', 'style', 'html', 'script']
  * object -- An object with the following keys:
    * `forbidden` -- An array of forbidden element names
    * `additionalForbidden` -- An array of forbidden strings that extends the default set of forbidden elements instead of replacing it
    * `message` -- A custom message to be displayed in place of the default error message

## References

* [Ember guides/template restrictions](https://guides.emberjs.com/release/components/#toc_restrictions)
