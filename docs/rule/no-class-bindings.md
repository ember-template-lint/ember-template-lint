# no-class-bindings

It is possible to pass `classBinding` and `classNameBindings` as arguments to a component when invoked with curly syntax.

```hbs
{{some-component classNameBindings="foo:truthy:falsy"}}
```

These arguments are merged into the `class` attribute, whether or not the component is a classic component (which contains the `classNameBindings` logic).

This rule disallows components accepting either `classBinding` or `classNameBindings`.

## Examples

This rule **forbids** the following:

```hbs
{{some-thing classBinding="lol"}}no
```

```hbs
<SomeThing @classBinding="lol" />
```

```hbs
{{some-thing classNameBindings="lol:foo:bar"}}
```

```hbs
<SomeThing @classNameBindings="lol:foo:bar" />
```

This rule **allows** the following:

```hbs
{{some-thing}}
```

```hbs
<SomeThing />
```

## Migration

- find in templates and remove `classBinding` and/or `classNameBindings`.

## References

- [RFC-0691 - Deprecate classBinding and classNameBindings](https://github.com/emberjs/rfcs/blob/master/text/0691-deprecate-class-binding-and-class-name-bindings.md)
