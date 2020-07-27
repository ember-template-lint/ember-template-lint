# no-duplicate-landmark-labels

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

If two of the same landmark elements or landmark roles are found in the same template, ensure that they have a unique label (provided by the aria-label or aria-labelledby attribute).

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
<nav></nav>
<nav></nav>
```

```hbs
<nav></nav>
<div role="navigation"></div>
```

```hbs
<nav aria-label="site navigation"></nav>
<nav aria-label="site navigation"></nav>
```

```hbs
<form aria-label="search-form"></form>
<form aria-label="search-form"></form>
```

This rule **allows** the following:

```hbs
<nav aria-label="primary site navigation"></nav>
<nav aria-label="secondary site navigation within home page"></nav>
```

```hbs
<nav aria-label="primary site navigation"></nav>
<div role="navigation" aria-label="secondary site navigation within home page"></div>
```
