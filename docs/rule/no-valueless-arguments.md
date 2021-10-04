# no-valueless-arguments

Similar to HTML attributes, component arguments will default to an empty string when they are not explicitly assigned a value. This behavior isn't documented anywhere so depending on it isn't recommended  and usually the result of a user-error. Since it _is_ valid syntax, accidental use of this behavior can be hard to detect and cause confusing bugs.

## Examples

This rule **forbids** the following:

```hbs
<Editor @defaultText />
```

```hbs
<SomeComponent @valuelessByAccident{{@canBeAModifier}} />
```

This rule **allows** the following:

```hbs
<Editor @defaultText="" />
```

## Migration

Explicitly assign a value to all arguments.

## Related Rules

- [ember/no-quoteless-attributes](no-quoteless-attributes.md)

## References

- [RFC-311: angle bracket invocation](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html)
- [Attributes in the HTML specification](https://html.spec.whatwg.org/#syntax-attributes))
