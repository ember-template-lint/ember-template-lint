# no-array-prototype-extensions

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Do not use array prototype extension properties like `{{list.firstObject.name}}`, `{{list.lastObject}}`.

The prototype extensions for the `Array` object were deprecated in [RFC #848](https://rfcs.emberjs.com/id/0848-deprecate-array-prototype-extensions).

This rule recommends the use of Ember's `get` helper as an alternative for accessing array values.

## Examples

### firstObject

This rule **forbids** the following:

```hbs
<Foo @bar={{@list.firstObject.name}} />
```

This rule **allows** the following:

```hbs
<Foo @bar={{get @list '0.name'}} />
```

### lastObject

This rule **forbids** the following:

```hbs
<Foo @bar={{@list.lastObject}} />
```

This rule **allows** the following:

Use JS approach

```js
import Component from '@glimmer/component';

export default class SampleComponent extends Component {
  abc = ['x', 'y', 'z', 'x'];

  get lastObj() {
    return abc[abc.length - 1];
  }
}
```

Then in your template

```hbs
<Foo @bar={{this.lastObj}} />
```

Or if you have ember-math-helpers addon included:

```hbs
<!-- ember-math-helpers included -->
<Foo @bar={{get @list (sub @list.length 1)}} />
```

## References

- [ember-math-helpers](https://shipshapecode.github.io/ember-math-helpers/)
- [Ember `get` helper documentation](https://guides.emberjs.com/release/components/helper-functions/#toc_the-get-helper)
- [EmberArray](https://api.emberjs.com/ember/release/classes/EmberArray)
- Ember [MutableArray](https://api.emberjs.com/ember/release/classes/MutableArray)
- [Ember prototype extensions documentation](https://guides.emberjs.com/release/configuring-ember/disabling-prototype-extensions/)
- [Ember Array prototype extensions deprecation RFC](https://rfcs.emberjs.com/id/0848-deprecate-array-prototype-extensions)

## Related rules

- [`ember/no-array-prototype-extensions`](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-array-prototype-extensions.md) from eslint-plugin-ember
