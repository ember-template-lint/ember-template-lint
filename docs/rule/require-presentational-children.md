# require-presentational-children

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

There are roles that require all children to be presentational. This rule checks if descendants of this element with this role type are presentational. By default, browsers are required to add `role="presentation"` to all descendants, but we should not rely on browsers to do this.

The roles that require all children to be presentational are:
* button
* checkbox
* img
* meter
* menuitemcheckbox
* menuitemradio
* option
* progressbar
* radio
* scrollbar
* separator
* slider
* switch
* tab

## Examples

This rule **forbids** the following:

```hbs
<li role="tab"><h3>Title of My Tab</h3></li>
```

```hbs
<div role="button">
  <h2 role="presentation">
    <button>Test <img/></button>
  </h2>
</div>
```

This rule **allows** the following:

```hbs
<li role="tab">Title of My Tab</li>
```

```hbs
<li role="tab"><h3 role="presentation">Title of My Tab</h3></li>
```

## Migration

If violations are found, remediation should be planned to either add `role="presentation"` to the descendants as a quickfix. A better fix is to not use semantic descendants.

## References
* [Roles That Automatically Hide Semantics by Making Their Descendants Presentational](https://w3c.github.io/aria-practices/#children_presentational)
