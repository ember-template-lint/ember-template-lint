# table-groups

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

It is best practice to group table rows into one of:

* `thead`
* `tbody`
* `tfoot`

This helps avoid a very nuanced (and possibly deprecated in the future) feature of glimmer that auto-inserts these tags.

This rule also enforces that all children of the `table` element are in the correct order:

* `caption`
* `colgroup`
* `thead`
* `tbody`
* `tfoot`

## Examples

This rule **forbids** the following:

```hbs
<table>
  <tr>
    <td></td>
  </tr>
</table>
```

```hbs
<table>
  {{some-thing content=content}}
</table>
```

```hbs
<table>
  <tfoot />
  <tbody />
  <thead />
</table>
```

This rule **allows** the following:

```hbs
<table>
  <tbody>
    <tr>
      <td></td>
    </tr>
  </tbody>
</table>
```

```hbs
<table>
  <tbody>
    {{some-thing content=content}}
  </tbody>
</table>
```

```hbs
<table>
  <thead />
  <tbody />
  <tfoot />
</table>
```

```hbs
<table>
  {{some-component tagName="tbody"}}
</table>
```

If you have a component with one of the table groups specified as its `tagName`, or it has no tag and instead only has valid children, you can
allow it with your configuration.

```js
'table-groups': {
  'allowable-tbody-components': 'some-component-with-tag-name-tbody',
}
```

```hbs
<table>
  {{some-component-with-tag-name-tbody}}
</table>
```

## Configuration

One of these:

* boolean - `true` to enable / `false` to disable
* object[] - with the following keys:
  * `allowed-caption-components` - string[] - components to treat as having the caption tag (using kebab-case names like `nested-scope/component-name`)
  * `allowed-colgroup-components` - string[] - components to treat as having the colgroup tag (using kebab-case names like `nested-scope/component-name`)
  * `allowed-thead-components` - string[] - components to treat as having the thead tag (using kebab-case names like `nested-scope/component-name`)
  * `allowed-tbody-components` - string[] - components to treat as having the tbody tag (using kebab-case names like `nested-scope/component-name`)
  * `allowed-tfoot-components` - string[] - components to treat as having the tfoot tag (using kebab-case names like `nested-scope/component-name`)
