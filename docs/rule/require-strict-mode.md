# require-strict-mode

Ember's Polaris edition component authoring format is template tag, which makes templates follow "strict mode" semantics.

This rule requires all templates to use strict mode (template tag). Effectively this means you may only have template content in `.gjs`/`.gts` files, not in `.hbs` or `.js`/`.ts`.

## Examples

This rule **forbids** the following:

```hbs
// button.hbs
<button>{{yield}}</button>
```

```js
// button-test.js
import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs`<Button>Ok</Button>`);
  // ...
});
```

This rule **allows** the following:

```gjs
// button.gjs
<template>
  <button>{{yield}}</button>
</template>  
```

```gjs
// button-test.gjs
import { Button } from 'ember-awesome-button';

test('it renders', async (assert) => {
  await render(<template><Button>Ok</Button></template>);
  // ..
});
```

## References

- [Template Tag Guide](https://guides.emberjs.com/release/components/template-tag-format/)
- [Strict Mode RFC](https://rfcs.emberjs.com/id/0496-handlebars-strict-mode/)
