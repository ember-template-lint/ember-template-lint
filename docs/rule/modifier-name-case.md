# modifier-name-case

It is currently possible to invoke a modifier with multiple words in its name
using camelCase: `{{didInsert}}` or using dasherized-case: `{{did-insert}}`.
This means that you can potentially have a lot of inconsistency throughout your
codebase.

This rule enforces that you will always use the dasherized-case form of the
modifier invocation.

## Examples

This rule **forbids** the following:

```hbs
<div {{didInsert}}></div>
```

This rule **allows** the following:

```hbs
<div {{did-insert}}></div>
```
