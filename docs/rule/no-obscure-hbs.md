# no-obscure-hbs

Using obscrure expressions `{{list.[1].name}}` is descouraged and might be deprecated soon

This rule suggests usage of the Ember's getter instead.

## Examples

This rule **forbids** the following:

```hbs
{{foo bar=list.[0]}}
```

```hbs
{{foo bar @list.[1]}}
```

```hbs
<Foo @bar={{list.[0]}} />
```

This rule **allows** the following:

```hbs
{{foo bar=(get list '0'}}
```

```hbs
{{foo bar (get @list '1')}}
```

```hbs
<Foo @bar={{get list '0'}} />
```

## References

- [Github Issue #787](https://github.com/ember-template-lint/ember-template-lint/issues/787)

