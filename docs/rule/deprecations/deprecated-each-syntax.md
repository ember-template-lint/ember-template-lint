## deprecated-each-syntax

In Ember 2.0, support for using the `in` form of the `{{#each}}` helper
has been removed.

For example, this rule forbids the following:

```hbs
{{#each post in posts}}
  <li>{{post.name}}</li>
{{/each}}
```

Instead, you should write the template as:

```hbs
{{#each posts as |post|}}
  <li>{{post.name}}</li>
{{/each}}
```

More information is available at the [Deprecation Guide](http://emberjs.com/deprecations/v1.x/#toc_code-in-code-syntax-for-code-each-code).
