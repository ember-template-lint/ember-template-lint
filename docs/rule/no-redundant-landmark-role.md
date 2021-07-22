# no-redundant-landmark-role

✅ The `extends: 'recommended'` property in a configuration file enables this rule.
🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

If a landmark element is used, any role provided will either be redundant or incorrect.
This rule adds support for landmark elements, to ensure that no role attribute is placed on any of
the landmark elements, with a few exceptions.

## Examples

This rule **forbids** the following:

```hbs
<header role="banner"></header>
```

```hbs
<main role="main"></main>
```

```hbs
<aside role="complementary"></aside>
```

```hbs
<nav role="navigation"></nav>
```

```hbs
<form role="form"></form>
```

This rule **allows** the following:

```hbs
<form role="search"></form>
```

```hbs
<footer role="contentinfo"></footer>
```

## References

- [Landmark Roles (WAI-ARIA spec)](https://www.w3.org/WAI/PF/aria/roles#landmark_roles)
- [Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11)
- [Document conformance requirements for use of ARIA attributes in HTML](https://www.w3.org/TR/html-aria/#docconformance)
