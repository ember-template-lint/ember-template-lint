# no-unnecessary-curly-parens

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Parentheses are used to wrap helpers within mustache expressions. There is no need to wrap the entire mustache expression.

## Examples

This rule **forbids** the following:

```hbs
{{(foo)}}
{{(concat "a" "b")}}
```

This rule **allows** the following:

```hbs
{{foo}}
{{concat "a" "b"}}
{{concat (capitalize "foo") "-bar"}}
```

## References

* Ember's [Helper Functions](https://guides.emberjs.com/release/components/helper-functions/) guide
