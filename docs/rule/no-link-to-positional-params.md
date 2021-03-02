# no-link-to-positional-params

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

Disallows passing positional parameters into link-to in favor of named arguments.

## Examples

This rule **forbids** the following:

```hbs
{{link-to "about"}}
```

```hbs
{{link-to "About Us" "about"}}
```

```hbs
{{#link-to "about"}}About Us{{/link-to}}
```

```hbs
{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}
```

```hbs
{{#link-to "post.comment" @comment.post @comment}}
  Comment by {{@comment.author.name}} on {{@comment.date}}
{{/link-to}}
```

```hbs
{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
  Recent Posts
{{/link-to}}
```

This rule **allows** the following:

```hbs
<LinkTo @route="about">About Us</LinkTo>
```

```hbs
<LinkTo @route="post" @model={{@post}}>Read {{@post.title}}...</LinkTo>
```

```hbs
<LinkTo @route="post.comment" @models={{array post comment}}>
  Comment by {{comment.author.name}} on {{comment.date}}
</LinkTo>
```

```hbs
<LinkTo @route="posts" @query={{hash direction="desc" showArchived=false}}>
  Recent Posts
</LinkTo>
```

## References

- More information is available in [RFC-0698](https://github.com/emberjs/rfcs/blob/master/text/0698-deprecate-link-to-positional-arguments.md)
