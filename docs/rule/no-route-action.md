# no-route-action

This rule disallows the usage of route-action.

[ember-route-action-helper](https://github.com/DockYard/ember-route-action-helper) is a popular addon that it's only purpose was to avoid creating controllers, something we no longer have a desire to do given the current state of the framework.

Most route actions should either be sent to the controller first or encapsulated within a downstream component instead. We should never be escaping the DDAU hierarchy to lob actions up to the route.

## Examples

This rule **forbids** the following:

```hbs
{{custom-component onUpdate=(route-action 'updateFoo')}}
```

```hbs
{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}
```

```hbs
<CustomComponent onUpdate={{route-action 'foo'}} />
```

```hbs
<CustomComponent onUpdate={{route-action 'foo' 'bar'}} />
```

Instead, use controller actions as the following:

```hbs
{{custom-component onUpdate=(this.updateFoo)}}
```

```hbs
{{custom-component onUpdate=(fn this.updateFoo 'bar')}}
```

```hbs
<CustomComponent onUpdate={{this.updateFoo}} />
```

```hbs
<CustomComponent onUpdate={{fn this.updateFoo 'bar'}} />
```
