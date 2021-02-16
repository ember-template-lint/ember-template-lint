# no-capital-arguments

Anything that does not start with a lowercase letter (such as @Foo, @0, @! etc) is reserved argument names. This is purely speculative and the goal is to carve out some space for future features. If we don't end up needing them, we can always relax the restrictions down the road.


'@arguments', '@args', '@block', '@else' - is reserved names, and also will be highlighted in this rule.

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## Examples

This rule **forbids** the following:

```hbs
<Foo @Bar={{true}} />
{{@Bar}}
```

```hbs
<Foo @A={{true}} @name={{@Bar}} />
```

This rule **allows** the following:

```hbs
<Foo @bar={{true}} />
{{@bar}}
```

```hbs
<Foo @a={{true}} @name={{@bar}} />
```

## References

* [RFC #276](https://github.com/emberjs/rfcs/blob/68812bf2d439c6bb77ad491e0159b371b68c5c35/text/0276-named-args.md#reserved-names)
