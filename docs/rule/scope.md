# scope

The scope attribute is used on <th> elements to clarify the relationship between a table's header and data cells for screen readers. Scope is set to "row" or "col" for header cells that refers to a given row or column. For header cells that reference multiple rows or columns, set the scope attribute to "rowgroup" and "colgroup" and define the range for the rows or columns.

This rule disallows the use of the scope attribute on HTML elements other than the <th> element.

## Examples

This rule **forbids** the following:

```hbs
<a scope='col'></a>
<table scope='rowgroup'></table>
```

This rule **allows** the following:

```hbs
<th scope='row'>A header cell</th>
<CustomHeader scope={{foo}} />
```

## References

- [Tables
  Concepts](https://www.w3.org/WAI/tutorials/tables/)
