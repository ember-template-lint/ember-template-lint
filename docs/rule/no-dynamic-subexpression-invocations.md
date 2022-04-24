# no-dynamic-subexpression-invocations

When using Ember versions prior to 3.25 the usage of dynamic invocations for
helpers and modifiers did not work. Unfortunately, some versions of Ember
silently ignored additional arguments (3.16) wherease others throw a very
bizarre error (3.20) when you attempt to invoke what the rendering engine knows as a
dynamic value as if it were a helper.

For example, in versions of Ember prior to 3.25 the helper invocation here is impossible:

```hbs
{{#if (this.someHelper)}}
  Hi!
{{/if}}
```

This rule helps applications using Ember versions prior to 3.25 avoid these types of invocation.

## Examples

This rule **forbids** the following:

```hbs
{{! invoking a yielded block param as if it were a helper }}

{{#let anything as |blockParamValue|}}
  <button onclick={{blockParamValue someArgument}}></button>
{{/let}}
```

```hbs
{{! invoking a path as if it were a helper }}

<Foo data-any-attribute={{this.anything someArgument}} />
<Foo data-any-attribute={{some.other.path someArgument}} />
```

```hbs
{{! invoking a yielded block param as if it were a modifier }}

{{#let anything as |blockParamValue|}}
  <Foo {{blockParamValue}} />
{{/let}}
```

```hbs
{{! invoking a path as if it were a modifier }}

<Foo {{this.anything}} />
<Foo {{some.other.path}} />
```

This rule **allows** the following:

```hbs
{{! use `fn` to wrap a function}}

{{#let anything as |blockParamValue|}}
  <button onclick={{fn blockParamValue someArgument}}></button>
{{/let}}
```

## References

RFC's introducing this functionality in Ember > 3.25:

* [emberjs/rfcs#432](https://github.com/emberjs/rfcs/blob/master/text/0432-contextual-helpers.md)
