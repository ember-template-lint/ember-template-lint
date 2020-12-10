# no-duplicate-landmark-elements

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

If multiple landmark elements of the same type are found on a page, they must each have a unique label (provided by aria-label or aria-labelledby).

List of elements & their corresponding roles:

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

```hbs
<form aria-label="shipping address"></form>
<form aria-label="billing address"></form>
```

```hbs
<form role="search" aria-label="search"></form>
<form aria-labelledby="form-title"><div id="form-title">Meaningful Form Title</div></form>
```

## References

- [WAI-ARIA specification: Landmark Roles](https://www.w3.org/WAI/PF/aria/roles#landmark_roles)
- [Understanding Success Criterion 1.3.1: Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- [Using aria-labelledby to name regions and landmarks](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA13.html)
- [Using aria-label to provide labels for objects](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6)
