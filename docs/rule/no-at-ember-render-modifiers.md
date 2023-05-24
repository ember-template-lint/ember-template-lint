# no-at-ember-render-modifiers

`@ember/render-modifiers` were meant as a transitional tool from the pre-Octane era, and not long-term usage.

More information about this can be found on the [`@ember/render-modifiers` README](https://github.com/emberjs/ember-render-modifiers#when-to-use-these-modifiers-and-when-not-to-use-them).

## Examples

This rule **forbids** the following:

```hbs
<div {{did-insert this.someFunction}}>
```

```hbs
<div {{did-update this.someFunction}}>
```

```hbs
<div {{will-destroy this.someFunction}}>
```

## Migration

The migration path typically depends on what the render-modifier was used for, but if you need a custom modifier, the [`ember-modifier` README](https://github.com/ember-modifier/ember-modifier) covers everything you need to know for making custom modifiers.

For example, if render modifiers were used for setup/teardown, the migration to `ember-modifier` could be the following:

```js
import { modifier } from 'ember-modifier';

export default class MyComponent extends Component {
  myModifier = modifier((element) => {
    let handleEvent = () => {};

    element.addEventListener('eventName', handleEvent);

    return () => element.removeEventListener('eventName', handelEvent);
  });
}
```

```hbs
<div {{this.myModifier}}>
```

## References

- [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers) (deprecated)
- [`ember-modifier`](https://github.com/ember-modifier/ember-modifier)
