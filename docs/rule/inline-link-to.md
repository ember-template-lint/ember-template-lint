# inline-link-to

:wrench: The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

Ember's `link-to` component has both an inline form and a block form. This rule forbids the inline form.

## Examples

This rule **forbids** the following (inline form):

```hbs
{{link-to 'Link text' 'routeName' prop1 prop2}}
```

This rule **allows** the following (block form):

```hbs
{{#link-to 'routeName' prop1 prop2}}Link text{{/link-to}}
```

The block form is a little longer but has advantages over the inline form:

* It maps closer to the use of HTML anchor tags which wrap their inner content.
* It provides an obvious way for developers to put nested markup and components inside of their link.
* The block form's argument order is more direct: "link to route". The inline form's argument order is somewhat ambiguous (link text then link target). This is opposite of the order in HTML (`href` then link text).

## References

* [Ember guides/routing](https://guides.emberjs.com/release/routing/linking-between-routes/#toc_the-linkto--component)
* [Ember api/LinkTo component](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo)
