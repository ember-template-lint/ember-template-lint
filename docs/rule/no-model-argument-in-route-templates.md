# no-model-argument-in-route-templates

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Usage of `{{@model}}` in route templates was introduced to simplify the mental
model in Ember Octane. Unfortunately, there is a known problem where usage of
`{{@model}}` can introduce difficult to diagnose failures when transitioning
within the same route (with different params, e.g. `/posts/1` -> `/posts/2`).

Given this route:

```js
// app/routes/post.js
export default class extends Route {
  model(params) {
    return this.store.findRecord('post', params.post_id);
  }
}
```

With the following template:

```hbs
{{! app/templates/post.hbs }}
{{some-helper @model}}
```

And a simple `some-helper` implementation like:

```js
// app/helpers/some-helper.js
export default helper(function(params) {
  console.log('some-helper:', ...params);
});
```

You'll notice that when transitioning into `/post/1` initially `some-helper`
will be invoked once (with the resolved model value), at this point things are
working as expected (the router did its job of absorbing the asynchrony in the
model hook).  However if you transition from `/posts/1` to `/posts/2`, you will
notice that `some-helper` is invoked **two** times:

* first with its argument as `undefined`
* second with its argument as the expected fully resolved model value

This demonstrates the problem clearly: you **never** expect for `{{@model}}` to
have been `undefined` and in a number of cases this will actually cause errors
(e.g. if your helper assumed an argument was an object and throw an error).

## Examples

This rule **forbids** usage of `{{@model}}` in route templates:

```hbs
{{@model}}
```

```hbs
{{@model.foo.bar}}
```

This rule **allows** the following:

```hbs
{{this.model}}
```

```hbs
{{this.model.foo}}
```

```hbs
{{this.model.foo.bar}}
```

## Migration

This rule includes a fixer in order to handle the migration for you automatically.

## References

* Ember.js issue: <https://github.com/emberjs/ember.js/issues/18987>
