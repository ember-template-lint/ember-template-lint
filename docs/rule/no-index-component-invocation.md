## no-index-component-invocation

Components and Component Templates can be structured as `app/components/foo-bar/index.js` and
`app/components/foo-bar/index.hbs`. This allows additional files related to the
component (such as a `README.md` file) to be co-located on the filesystem.

For template-only components, they can be either `app/components/foo-bar.hbs`
or `app/components/foo-bar/index.hbs` without a corresponding JavaScript file.

Similarly, for addons, templates can be placed inside `addon/components` with
the same rules laid out above.

In all of these case, if a template file is present in `app/components` or
`addon/components`, it will take precedence over any corresponding template
files in `app/templates`, the `layout` property on classic components, or a
template with the same name that is made available with the resolver API.
Instead of being resolved at runtime, a template in `app/components` will be
associated with the component's JavaScript class at build time.

### Examples

This rule **forbids** the following:

```hbs
<Foo::Index />
```

```hbs
{{component "foo/index"}}
```

```hbs
{{foo/index}}
```

This rule **allows** the following:

```hbs
<Foo />
```

```hbs
{{component "foo"}}
```

```hbs
{{foo}}
```

### Migration

* replace all `::Index>` to `>`
* replace all `/index}}` to `}}`

### References

* [RFC #481](https://github.com/emberjs/rfcs/blob/master/text/0481-component-templates-co-location.md#high-level-design)
