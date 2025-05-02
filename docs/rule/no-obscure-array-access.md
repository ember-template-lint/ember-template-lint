# no-obscure-array-access

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Using obscure expressions `{{list.[1].name}}` is discouraged and is likely to be deprecated soon.
This rule recommends the use of Ember's `get` helper as an alternative for accessing array values.

## Examples

This rule **forbids** the following:

```hbs
<Foo @bar={{@list.[0]}} />
```

This rule **allows** the following:

```hbs
<Foo @bar={{get @list '0'}} />
```

## References

- [Ember discord discussion in ember-cli channel on 02/06/19](https://discord.com/channels/480462759797063690/486548111221719040/542753450144956436)
- [Ember get helper documentation](https://guides.emberjs.com/release/components/helper-functions/#toc_the-get-helper)
