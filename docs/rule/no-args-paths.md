## no-args-paths

Arguments that are passed to components are prefixed with the `@` symbol in Angle bracket syntax.
Ember Octane leverages this in the component's templates by allowing users to directly refer to an argument using the same prefix:

```hbs
<!-- todo-list.hbs -->
<ul>
  {{#each @todos as |todo index|}}
    <li>
      {{yield (todo-item-component todo=todo) index}}
    </li>
  {{/each}}
</ul>
```

We can immediately tell now by looking at this template that `@todos` is an argument that was passed to the component externally. This is in fact _always true_ - there is no way to modify the value referenced by `@todos` from the component class, it is the original, unmodified value. 

### Examples

This rule **forbids** the following:

```hbs
{{this.args.foo}}
{{args.foo}}
```

```hbs
{{my-helper this.args.foo}}
{{my-helper (hash value=this.args.foo)}}
```

```hbs
<MyComponent @value={{this.args.foo}} />
<div {{my-modifier this.args.foo}}></div>
```

This rule **allows** the following:

```hbs
{{my-helper this.args}}
{{my-helper (hash value=this.args)}}
```

```hbs
{{@foo}}
<MyComponent @value={{@foo}} />
<div {{my-modifier @foo}}></div>
```


### Migration

* find in templates `this.args.` replace to `@`

### Related Rules

* [no-curly-component-invocation](no-curly-component-invocation.md)

### References

* [RFC #276](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md)
* [Coming Soon in Ember Octane - Part 2: Named Argument Syntax](https://www.pzuraq.com/coming-soon-in-ember-octane-part-2-angle-brackets-and-named-arguments/#namedargumentsyntax)
* [Named arguments in Ember.js](https://www.balinterdi.com/blog/named-arguments-in-ember-js/)
* [ember-named-arguments-polyfill](https://github.com/rwjblue/ember-named-arguments-polyfill)