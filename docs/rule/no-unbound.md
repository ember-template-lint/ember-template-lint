## no-unbound

`{{unbound}}` is a legacy hold over from the days in which Ember's template engine was less performant. It's use today
is vestigial, and it no longer offers performance benefits.

This rule forbids usage of the following:

```hbs
{{unbound aVar}}
```

And

```hbs
{{a-thing foo=(unbound aVar)}}
```
