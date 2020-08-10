# require-context-role

## `<* role><* role /></*>`

The required context role defines the owning container where this role is allowed. If a role has a required context, authors MUST ensure that an element with the role is contained inside (or owned by) an element with the required context role. For example, an element with `role="listitem"` is only meaningful when contained inside (or owned by) an element with `role="list"`.

## Roles to check

Format: role | required context role

* columnheader | row
* gridcell | row
* listitem | group or list
* menuitem | group, menu, or menubar
* menuitemcheckbox | menu or menubar
* menuitemradio | group, menu, or menubar
* option | listbox
* row | grid, rowgroup, or treegrid
* rowgroup | grid
* rowheader | row
* tab | tablist
* treeitem | group or tree

## Examples

This rule **allows** the following:

```hbs
<div role="list">
  <div role="listitem">Item One</div>
  <div role="listitem">Item Two</div>
</div>
```

This rule **forbids** the following:

```hbs
<div>
  <div role="listitem">Item One</div>
  <div role="listitem">Item Two</div>
</div>
```

### References

1. <https://www.w3.org/TR/wai-aria-1.0/roles#scope>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#columnheader>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#gridcell>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#listitem>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#menuitem>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#menuitemcheckbox>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#menuitemradio>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#option>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#row>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#rowgroup>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#rowheader>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#tab>
1. <https://www.w3.org/TR/wai-aria-1.0/roles#treeitem>
