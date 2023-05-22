# simple-modifiers

This rule strongly advises against passing complex statements or conditionals to the first argument of the `{{modifier}}` helper. Instead, it recommends using the `{{modifier}}` helper with its first argument being either:

- a string literal (.e.g. `{{modifier "tracking-interaction"}}`)
- a variable in the template's JS backing class context (e.g. `{{modifier this.trackingInteraction}}`)

A common issue this rule will catch is declaring the modifier's name conditionally like `{{(modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}`. This is technically correct since the helper `modifier` simply ignores `null` and `undefined` values producing a no-op modifier but it is confusing. Ideally the we should instead do `{{(unless this.hasBeenClicked (modifier "track-interaction" "click" customizeData=this.customizeClickData))}}` where it's clear the modifier will not get called.

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
