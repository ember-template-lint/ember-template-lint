# no-redundant-role

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

The rule checks for redundancy between any semantic HTML element with a default/implicit ARIA role and the role provided.

For example, if a landmark element is used, any role provided will either be redundant or incorrect. This rule ensures that no role attribute is placed on any of the landmark elements, with the following exceptions:

- a `nav` element with the `navigation` role to [make the structure of the page more accessible to user agents](https://www.w3.org/WAI/GL/wiki/Using_HTML5_nav_element#Example:The_.3Cnav.3E_element)
- a `form` element with the `search` role to [identify the form's search functionality](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role#examples)
- a `input` element with `combobox` role to [identify the input as a combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/)

## Examples

This rule **forbids** the following:

```hbs
<header role='banner'></header>
```

```hbs
<main role='main'></main>
```

```hbs
<aside role='complementary'></aside>
```

```hbs
<footer role='contentinfo'></footer>
```

```hbs
<form role='form'></form>
```

This rule **allows** the following:

```hbs
<form role='search'></form>
```

```hbs
<nav role='navigation'></nav>
```

```hbs
<input role='combobox' />
```

## Configuration

- boolean -- if `true`, default configuration is applied

- object -- containing the following property:
  - boolean -- `checkAllHTMLElements` -- if `true`, the rule checks for redundancy between any semantic HTML element with a default/implicit ARIA role and the role provided, instead of just landmark roles (default: `true`)

## References

- [Landmark Roles (WAI-ARIA spec)](https://www.w3.org/WAI/PF/aria/roles#landmark_roles)
- [Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11)
- [Document conformance requirements for use of ARIA attributes in HTML](https://www.w3.org/TR/html-aria/#docconformance)
- [ARIA Spec, ARIA Adds Nothing to Default Semantics of Most HTML Elements](https://www.w3.org/TR/using-aria/#aria-does-nothing)
