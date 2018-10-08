## no-action-modifiers

This rule forbids the use of `{{action}}` modifiers on elements. The following
code will throw an error:

```hbs
<button {{action 'handleClick'}}>
```

The following code will be accepted:

```hbs
<button onclick={{action 'handleClick'}}>
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
  * array -- an array of whitelisted element tag names, which will accept action modifiers
