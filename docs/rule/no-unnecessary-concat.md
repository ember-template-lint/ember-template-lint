# no-unnecessary-concat

:dress: The `extends: 'stylistic'` property in a configuration file enables this rule.

This rule forbids unnecessary use of quotes (`""`) around expressions like `{{myValue}}`.

## Examples

This rule **forbids** the following:

```hbs
<span class="{{if errors.length 'text-danger' 'text-grey'}}">

<img src="{{customSrc}}" alt="{{customAlt}}">

<label for="{{concat elementId "-date"}}">
```

This rule **allows** the following:

```hbs
<span class={{if errors.length 'text-danger' 'text-grey'}}>

<img src={{customSrc}} alt={{customAlt}}>

<label for={{concat elementId "-date"}}>
```

## Migration

Use regexp find-and-replace to fix existing violations of this rule:

| Before | After |
| --- | --- |
| `="{{([^}]+)}}"` | `={{$1}}` |

## References

* [Handlebars docs/expressions](https://handlebarsjs.com/guide/expressions.html)
* [Ember api/concat helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
