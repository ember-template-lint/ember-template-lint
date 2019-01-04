## no-action-modifiers

This rule forbids the use of `{{action}}` modifiers on elements.

This rule **forbids** the following:

```hbs
<button {{action 'handleClick'}}>
```

This rule **allows** the following:

```hbs
<button onclick={{action 'handleClick'}}>
```

### Configuration

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
  * array -- an array of whitelisted element tag names, which will accept action modifiers
