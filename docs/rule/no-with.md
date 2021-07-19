# no-with

The use of `{{with}}` has been deprecated, you should replace it with either `{{let}}` or a combination of `{{let}}`, `{{if}}` and `{{else}}`.

## Examples

This rule **forbids** the following:

```hbs
{{#with (hash name="Ben" age=4) as |person|}}
  Hi {{person.name}}, you are {{person.age}} years old.
{{/with}}
```

```hbs
{{#with user.posts as |blogPosts|}}
  There are {{blogPosts.length}} blog posts.
{{/with}}
```

```hbs
{{#with user.posts as |blogPosts|}}
  There are {{blogPosts.length}} blog posts.
{{else}}
  There are no blog posts.
{{/with}}
```

This rule **allows** the following:

```hbs
{{#let (hash name="Ben" age=4) as |person|}}
  Hi {{person.name}}, you are {{person.age}} years old.
{{/let}}
```

```hbs
{{#let user.posts as |blogPosts|}}
  {{#if blogPosts}}
    There are {{blogPosts.length}} blog posts.
  {{/if}}
{{/let}}
```

```hbs
{{#let user.posts as |blogPosts|}}
  {{#if blogPosts}}
    There are {{blogPosts.length}} blog posts.
  {{else}}
    There are no blog posts.
  {{/if}}
{{/let}}
```

## References

- [Deprecate {{with}} RFC](https://github.com/emberjs/rfcs/blob/master/text/0445-deprecate-with.md)
- More information is available at the [Deprecation Guide](https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax)
