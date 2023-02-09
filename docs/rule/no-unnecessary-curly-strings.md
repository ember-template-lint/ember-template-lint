# no-unnecessary-curly-strings

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
