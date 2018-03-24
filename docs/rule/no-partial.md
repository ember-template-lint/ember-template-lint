## no-partial

`{{partial}}` is a legacy hold over from the days in which Ember had little to
no mechanism for sharing "template snippets". Today we can use "contextual
components" (and soon "named blocks"), which serves the original need for
`{{partial`.

In addition to having a better solution for the original problem, there are also a number of issues when using `{{partial`:

* `{{partial` usage is essentially "eval", which means that Ember's template rendering system can make little to no optimizations
* `{{partial` usage provides the partial template with unrestricted access to the local scope which leads to extreme confusion and "scope creep"

This rule forbids usage of the following:

```hbs
{{partial "foo"}}
```
