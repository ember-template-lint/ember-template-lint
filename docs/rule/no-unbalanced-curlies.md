# no-unbalanced-curlies

Normally, the compiler will find stray curlies and throw a syntax error. However, it won't be able to catch every case.

For example, these are all syntax errors:

```hbs
{{ x }
{{ x }}}
{{{ x }
{{{ x }}
```

Whereas these are not:

```hbs
{ x }}
{ x }
}
}}
}}}
}}}}... (any number of closing curlies past one)
```

This rule focuses on closing double `}}` and triple `}}}` curlies with no matching opening curlies.

## Examples

This rule **forbids** the following:

```hbs
foo}}
{foo}}
foo}}}
{foo}}}
```

## Migration

If you have curlies in your code that you wish to show verbatim, but are flagged by this rule, you can formulate them as a handlebars expression:

```hbs
<p>This is a closing double curly: {{ '}}' }}</p>
<p>This is a closing triple curly: {{ '}}}' }}</p>
```
