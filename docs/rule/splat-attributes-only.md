# splat-attributes-only

It is easy to introduce typos when typing out `...attributes` or to use e.g.
`...arguments` instead. Unfortunately, that leads to a cryptic runtime error,
but does not fail the build.

This rule warns you when you use an attribute starting with `...` that is **not**
`...attributes`.

## Examples

This rule **forbids** the following:

```hbs
<div ...atributes></div>
```

```hbs
<div ...arguments></div>
```

This rule **allows** the following:

```hbs
<div ...attributes></div>
```

## References

* [Ember 3.11 release](https://blog.emberjs.com/2019/07/15/ember-3-11-released.html)
