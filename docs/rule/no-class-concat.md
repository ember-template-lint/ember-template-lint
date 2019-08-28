## no-class-concat

Concating class names causes issues with maintainability. Disallowing concating class names will help ensure that class names are defined statically. 

This rule **forbids** the following:

```hbs
<div class={{concat "foo" bar}}>
```

This rule **allows** the following:

```hbs
<div class="foo">
```
