# no-outlet-outside-routes

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

The `{{outlet}}` helper is used to specify locations into which routes may be rendered. Typically, to keep routing clear, only route templates should make use of `{{outlet}}`. Using `{{outlet}}` outside of a route template, e.g. in a component or a partial, will often lead to unexpected rendering locations for child routes.

## Examples

This rule **forbids** the following (except in routes):

```hbs
{{outlet}}
```

## References

* [Ember guides/routing](https://guides.emberjs.com/release/routing/rendering-a-template/)
* [Ember api/outlet helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/outlet?anchor=outlet)
