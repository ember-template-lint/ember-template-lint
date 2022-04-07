# require-context-role

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

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

1. <https://www.w3.org/TR/wai-aria-1.1/#scope>
1. <https://www.w3.org/TR/wai-aria-1.1/#columnheader>
1. <https://www.w3.org/TR/wai-aria-1.1/#gridcell>
1. <https://www.w3.org/TR/wai-aria-1.1/#listitem>
1. <https://www.w3.org/TR/wai-aria-1.1/#menuitem>
1. <https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox>
1. <https://www.w3.org/TR/wai-aria-1.1/#menuitemradio>
1. <https://www.w3.org/TR/wai-aria-1.1/#option>
1. <https://www.w3.org/TR/wai-aria-1.1/#row>
1. <https://www.w3.org/TR/wai-aria-1.1/#rowgroup>
1. <https://www.w3.org/TR/wai-aria-1.1/#rowheader>
1. <https://www.w3.org/TR/wai-aria-1.1/#tab>
1. <https://www.w3.org/TR/wai-aria-1.1/#treeitem>
