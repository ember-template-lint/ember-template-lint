# no-route-action

This rule disallows the usage of `route-action`.

[ember-route-action-helper](https://github.com/DockYard/ember-route-action-helper) was a popular addon used to avoid creating controllers just to add actions to routes. Given the changes in Ember since ember-route-action-helper was useful, controllers are now a useful pattern we want to encourage and discourage the use of route-action.

Most route actions should either be sent to the controller first or encapsulated within a downstream component instead. We should never be escaping the DDAU hierarchy to lob actions up to the route.

## Examples

This rule **forbids** the following:

```hbs
<CustomComponent @onUpdate={{route-action 'updateFoo'}} />
```

```hbs
<CustomComponent @onUpdate={{route-action 'updateFoo' 'bar'}} />
```

```hbs
{{custom-component onUpdate=(route-action 'updateFoo')}}
```

```hbs
{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}
```

With the given route:
```js
// app/routes/foo.js
export default class extends Route {
  @action
  updateFoo(baz) {
    // ...
  }
}
```

This rule **allows** the following:

```hbs
<CustomComponent @onUpdate={{this.updateFoo}} />
```

```hbs
<CustomComponent @onUpdate={{fn this.updateFoo 'bar'}} />
```

```hbs
{{custom-component onUpdate=this.updateFoo}}
```

```hbs
{{custom-component onUpdate=(fn this.updateFoo 'bar')}}
```

With the given controller:
```js
// app/controllers/foo.js
export default class extends Controller {
  @action
  updateFoo(baz) {
    // ...
  }
}
```

## Migration

The example below shows how to migrate from route-action to controller actions.

**Before**

```js
// app/routes/posts.js
export default class extends Route {
  model(params) {
    return this.store.query('post', { page: params.page })
  }

  @action
  goToPage(pageNum) {
    this.transitionTo({ queryParams: { page: pageNum } });
  }
}
```

```js
// app/controllers/posts.js
export default class extends Controller {
  queryParams = ['page'];
  page = 1;
}
```

```hbs
{{#each @model as |post|}}
  <Post @title={{post.title}} @content={{post.content}} />
{{/each}}

<button {{action (route-action 'goToPage' 1)}}>1</button>
<button {{action (route-action 'goToPage' 2)}}>2</button>
<button {{action (route-action 'goToPage' 3)}}>3</button>
```

**After**

```js
// app/routes/posts.js
export default class extends Route {
  model(params) {
    return this.store.query('post', { page: params.page })
  }
}
```

```js
// app/controllers/posts.js
export default class extends Controller {
  queryParams = ['page'];
  page = 1;

  @action
  goToPage(pageNum) {
    this.transitionToRoute({ queryParams: { page: pageNum } });
  }
}
```

```hbs
{{#each @model as |post|}}
  <Post @title={{post.title}} @content={{post.content}} />
{{/each}}

<button {{on 'click' (fn this.goToPage 1)}}>1</button>
<button {{on 'click' (fn this.goToPage 2)}}>2</button>
<button {{on 'click' (fn this.goToPage 3)}}>3</button>
```

## References

* [ember-route-action-helper](https://github.com/DockYard/ember-route-action-helper)
* [Ember guides/Controllers](https://guides.emberjs.com/release/routing/controllers/)
* [Ember Best Practices: What are controllers good for?](https://dockyard.com/blog/2017/06/16/ember-best-practices-what-are-controllers-good-for)
