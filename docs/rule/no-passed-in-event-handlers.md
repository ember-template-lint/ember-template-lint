# no-passed-in-event-handlers

:white_check_mark: The `extends: 'recommended'` property in a configuration file enables this rule.

It is possible to pass e.g. `@click` to an Ember component to override the
default `click` event handler. For tagless components this will trigger an
assertion though and can't be used as legitimate API, and for Glimmer
components it will not work out of the box, like in Ember components, either.

This rule scans potential component invocations for these patterns and flags
them as issues.

## Examples

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

## Configuration

- boolean - `true` to enable / `false` to disable

  - object -- An object with the following keys:

    - `ignore` -- An object with the following keys/values:

      - key: string -- The name of the element or mustache statement to ignore event handlers for
      - value: array -- Event handler names. Event handler names should exclude the @ when specifying those intended for named arguments. This rule will ensure both non-named arguments and named arguments are both ignored appropriately.

      eg.

      Given the following configuration:

      ```json
      {
        "ignore": {
          "MyButton": ["click"]
        }
      }
      ```

## Migration

- create explicit component APIs for these events (e.g. `@click` -> `@onClick`)

## References

- <https://api.emberjs.com/ember/release/classes/Component#event-handler-methods>
