# no-abstract-roles

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

The HTML attribute `role` must never have the following values:

* `command`
* `composite`
* `input`
* `landmark`
* `range`
* `roletype`
* `section`
* `sectionhead`
* `select`
* `structure`
* `widget`
* `window`

## Examples

This rule **forbids** the following:

```hbs
<div role="window"> Hello, world! </div>
```

This rule **allows** the following:

```hbs
<div role="button"> Push it </div>
```

## References

* See [https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)
