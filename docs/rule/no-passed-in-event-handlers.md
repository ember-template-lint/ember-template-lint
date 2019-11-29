## no-passed-in-event-handlers

It is possible to pass e.g. `@click` to an Ember component to override the
default `click` event handler. For tagless components this will trigger an
assertion though and can't be used as legitimate API, and for Glimmer
components it will not work out of the box, like in Ember components, either.

This rule scans potential component invocations for these patterns and flags
them as issues.

### Examples

This rule **forbids** the following:

```hbs
<Foo @click={{this.handleClick}} />
```

```hbs
<Foo @keyPress={{this.handleClick}} />
```

```hbs
{{foo click=this.handleClick}}
```

This rule **allows** the following:

```hbs
<Foo @onClick={{this.handleClick}} />
```

```hbs
<Foo @myCustomClickHandler={{this.handleClick}} />
```

```hbs
<Foo @onKeyPress={{this.handleClick}} />
```

```hbs
{{foo onClick=this.handleClick}}
```

### Migration

* create explicit component APIs for these events (e.g. `@click` -> `@onClick`)
