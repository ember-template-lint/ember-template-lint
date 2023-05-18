# simple-modifiers

This rule strongly advises against using the `{{modifier}}` helper with its first argument being either:

- a string literal (.e.g. `{{modifier "tracking-interaction"}}`)
- a variable in the template's JS backing class context (e.g. `{{modifier this.trackingInteraction}}`)

A common misuse of this rule is to apply the modifier conditionally `{{(modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}`, which technically is not wrong, since the helper `modifier` simply ignores `null` and `undefined`, producing a no-op modifier.

## Examples

This rule **forbids** the following:

```hbs
<div
  {{(modifier
    (unless this.hasBeenClicked 'track-interaction') 'click' customizeData=this.customizeClickData
  )}}
></div>
```

This rule **allows** the following:

```hbs
<div
  {{(unless
    this.hasBeenClicked (modifier 'track-interaction' 'click' customizeData=this.customizeClickData)
  )}}
></div>
```

## References

- [Documentation](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/#toc_event-handlers) for modifiers
