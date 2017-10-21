## deprecated-render-helper

In Ember 2.6 and newer, support for using the `{{render}}` helper has been deprecated.

For example, this rule forbids the following:

```hbs
{{render 'this-is-bad'}}

{{render 'also-bad' model}}
```

Instead, you should use:

```hbs
{{this-is-better}}

{{saul-goodman model=model}}
```

More information is available at the [Deprecation Guide](https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper).
