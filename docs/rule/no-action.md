## no-action

What's wrong with `{{action}}`?

"Action" is an overloaded term in Ember parlance. Actions are:

1.) Methods on the `actions` hash
```js
actions: {
  helloWorld() {}
}
```

2.) But also element modifiers that setup event handlers?
```hbs
<div {{action 'helloWorld'}}></div>
```

3.) Oh, and they are partial applied functions too:
```hbs
{{some-component onClick=(action 'addNumbers' 1 2 3)}}
```

4.) Also, they usually receive strings, but can also receive functions?
```hbs
<div {{action this.someMethod}}></div>
```

They're something we pass downward, but also something we send back up (as in Data Down, Actions Up). They are the way you interact with the DOM, except when you need to actually access the event itself, or when you use the `click` method on a classic component class. The point is, if you try to ask a group of experienced Ember devs to define what an "action" is, you may get a few contradicting/overlapping opinions.

Actions have served many different purposes over the years, and this makes them difficult to learn, to teach, and to repurpose.

```hbs
<button {{action "increment" 5}}>Click</button>
<button {{action this.increment 5}}>Click</button>
<button onclick={{action "increment" 5}}>Click</button>
<button onclick={{action this.increment 5}}>Click</button>
<button {{action (action "increment" 5)}}>Click</button>
<button {{action (action this.increment 5)}}>Click</button>
```

We wanted to separate out the different responsibilities here, and the `@action` decorator was the first part of the puzzle, and the other two pieces are the `{{fn}}` helper and `{{on}}` modifier.

### Examples

This rule **forbids** the following:


```hbs
<button onclick={{action 'foo'}}></button>
```

```hbs
<button {{action 'submit'}}>Submit</button>
```

```hbs
<FooBar @baz={{action 'submit'}} />
```

```hbs
{{yield (action 'foo')}}
```

```hbs
{{yield (action this.foo)}}
```

This rule **allows** the following:

```hbs
<button {{on "submit" @action}}>Click Me</button>
```

```hbs
<button {{on "submit" this.action}}>Click Me</button>
```

### Migration

```hbs
<select onchange={{action this.updateSelection this.options}}>
  {{#each this.options as |opt|}}
    <option>{{opt.value}}<option>
  {{/each}}
</select>
```
to

```hbs
<select {{on 'change' (fn this.updateSelection this.options)}}>
  {{#each this.options as |opt|}}
    <option>{{opt.value}}<option>
  {{/each}}
</select>
```

### Related Rules

* [no-action-modifiers](no-action-modifiers.md)
* [no-element-event-actions](no-element-event-actions.md)

### References

* [Ember Octane Update: What's up with `@action`?](https://www.pzuraq.com/ember-octane-update-action/)
* [RFC-471 `on` modifier](https://github.com/emberjs/rfcs/blob/master/text/0471-on-modifier.md)
* [RFC-470 `fn` helper](https://github.com/emberjs/rfcs/blob/master/text/0470-fn-helper.md)
* [Intent to RFC: Deprecate `{{action}}`](https://github.com/emberjs/rfcs/issues/537)
