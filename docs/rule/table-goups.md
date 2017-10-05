## table-groups

A table row should always be groouped into either a `thead`, `tbody` or `tfoot` to avoid a very nuanced (and possibly deprecated in the future) feature of glimmer that auto-inserts these tags.

The rule forbids the following:

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

Instead, you should write your table as:

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

If you have a component which `tagName` is either `thead`, `tbody` or `tfoot`, you should disable the rule inline:

```hbs
<table>
  {{! template-lint-disable table-groups }}
  {{some-thing-with-tagName-tbody}}
</table>
```
