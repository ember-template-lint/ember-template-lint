# sort-invocations

🔧 The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## Why use it?

The rule helps you standardize templates:

- Component invocations
- Helper invocations
- Modifier invocations

By sorting things that are order-independent, you can more easily refactor code. In addition, sorting removes style differences, so you can review another person's code more effectively.

> [!TIP]
>
> The `--fix` option for this rule doesn't preserve formatting. You can use [`prettier-plugin-ember-hbs-tag`](https://github.com/ijlee2/prettier-plugin-ember-hbs-tag) and [`prettier-plugin-ember-template-tag`](https://github.com/ember-tooling/prettier-plugin-ember-template-tag) to format `*.hbs` and `*.{gjs,gts}`, respectively.

## Examples

### Components

When invoking a component, list things in the following order:

1. Arguments
2. Attributes
3. Modifiers
4. Splattributes

The order clearly shows how the component is customized more and more. Things are alphabetized within each group.

```hbs
<Ui::Button
  @label="Submit form"
  @type="submit"
  data-test-button
  {{on "click" this.doSomething}}
  ...attributes
/>
```

> [!NOTE]
>
> In rare cases, the order of [`...attributes`](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes/#toc_html-attributes) can matter. Similarly, the order can matter when an [ARIA attribute has multiple values](https://github.com/ijlee2/ember-container-query/issues/38#issuecomment-647017665).
>
> Disable the rule per instance in either case.

### Helpers

When invoking a helper, list the named arguments in alphabetical order.

```hbs
{{t
  "my-component.description"
  installedOn=this.installationDate
  packageName="@ember/source"
  packageVersion="6.0.0"
}}
```

### Modifiers

Similarly to helpers, list the named arguments in alphabetical order.

## Limitations

It's intended that there are no options for sorting. Alphabetical sort is the simplest for everyone to understand and to apply across different projects. It's also the easiest to maintain.

To better meet your needs, consider creating a plugin for `ember-template-lint`.

## Known issues

1\. If you passed an empty string as an argument's value, it has been replaced with `{{""}}`. Let [`ember-template-lint`](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-unnecessary-curly-strings.md) fix the formatting change.

```diff
- <MyComponent @description={{""}} />
+ <MyComponent @description="" />
```

2\. Comments such as `{{! @glint-expect-error }}` may have shifted. Move them to the correct location.

## References

Source code and tests were copied from [`ember-codemod-sort-invocations`](https://github.com/ijlee2/ember-codemod-sort-invocations).
