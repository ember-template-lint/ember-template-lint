# no-chained-this

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

This rule disallows chaining `this.this` inside templates — such as `{{this.this.foo}}` or `<this.this.bar />`. These patterns are misleading, usually unintentional, and result in unnecessary ambiguity about scope and component context.

## Motivation

Templates are meant to clearly reference local properties, arguments (`@arg`), or component state via `this`. When you see `this.this.foo`, it's either:

- A typo (e.g., copy/paste or incorrect refactor)
- A misunderstanding of Glimmer component boundaries
- A misuse of dynamic component invocation (e.g., `<this.this.foo />`)

These patterns often go unnoticed but produce confusing or broken runtime behavior.

## Examples

This rule **forbids** the following:

```hbs
{{this.this.value}}
```

```hbs
{{#this.this.foo}}
some text
{{/this.this.foo}}
```

```hbs
{{helper value=this.this.foo}}
```

```hbs
<this.this.Component />
```

```hbs
{{#if this.this.condition}}
  ...
{{/if}}
```

```hbs
{{component this.this.dynamicComponent}}
```

This rule **allows** the following:

```hbs
{{this.value}}
```

```hbs
<this.Component />
```

```hbs
{{component this.dynamicComponent}}
```

```hbs
{{@argName}}
```

## Migration

Just remove the extra `this`:

Before:

```hbs
{{this.this.foo}}
<this.this.bar />
```

After:

```hbs
{{this.foo}}
<this.bar />
```

## References

- [Ember Guides – Glimmer Component Templates](https://guides.emberjs.com/v5.5.0/upgrading/current-edition/glimmer-components/)
- [Handlebars Strict Mode](https://github.com/emberjs/rfcs/blob/master/text/0496-handlebars-strict-mode.md)
