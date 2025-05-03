# no-scope-outside-table-headings

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

The scope attribute is used on `<th>` elements to clarify the relationship between a table's header cells and data cells for screen readers. Scope is set to "row" or "col" for header cells that refer to a given row or column. For header cells that reference multiple rows or columns, set the scope attribute to "rowgroup" and "colgroup" and define the range for the rows or columns.

This rule disallows the use of the scope attribute on HTML elements other than the `<th>` element.

## Examples

This rule **forbids** the following:

```hbs
<a scope="col"></a>
<table scope="rowgroup"></table>
```

This rule **allows** the following:

```hbs
<th scope="row">A header cell</th>
<CustomHeader scope={{foo}} />
```

## References

- [HTML \<th\> scope Attribute](https://www.w3schools.com/tags/att_th_scope.asp)
- [scope - eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/scope.md)
