# no-obscure-array-access

Using obscrure expressions `{{list.[1].name}}` is descouraged and might be deprecated soon

This rule suggests usage of the Ember's get helper instead.

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

- [Ember discord discussion in ember-cli channel on 02/06/19](https://discord.com/channels/480462759797063690/486548111221719040)
