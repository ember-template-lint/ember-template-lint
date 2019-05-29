## no-element-event-actions

Using HTML element event properties such as `onclick` for Ember actions is not recommended for the following reasons:

* It doesn't work for SVGs (since there is no `onclick` property of `SVGElement`).
* It can lead to confusing and unexpected behavior when mixed with normal action usage. For a comprehensive explanation of why, read [Deep Dive on Ember Events].

This rule **forbids** the following:

```hbs
<button onclick={{action "submit"}}>Submit</button>
```

This rule **allows** the following:

```hbs
<button {{action "submit"}}>Submit</button>
```

```hbs
<button {{action "submit" on="doubleClick"}}>Submit On Double Click</button>
```

### References

* [Deep Dive on Ember Events]
* Ember [Template Action](https://guides.emberjs.com/release/templates/actions/) documentation
* [List of DOM Events](https://developer.mozilla.org/en-US/docs/Web/Events)

[Deep Dive on Ember Events]: https://medium.com/square-corner-blog/deep-dive-on-ember-events-cf684fd3b808

### Related Rules

* [no-action-modifiers](no-action-modifiers.md)
