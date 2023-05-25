# no-unnecessary-curly-strings

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Strings need not be wrapped in the curly braces (mustache expressions).

## Examples

This rule **forbids** the following:

```hbs
<FooBar class={{"btn"}} />
```

```hbs
<FooBar class="btn">{{"Hello"}}</FooBar>
```

This rule **allows** the following:

```hbs
<FooBar class="btn" />
```

```hbs
<FooBar class="btn">Hello</FooBar>
```

## References

- [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html)
