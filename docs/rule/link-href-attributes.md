## link-href-attributes

It's common to treat anchor tags as a button: `<a {{action 'handleClick'}}>Submit</a>`.

However, this is typically considered bad practice as an anchor tag without an `href` is unfocusable which break accessability.

This rule forbids the following:

```hbs
<a>I'm a fake link</a>
<a {{action 'handleClick'}}>I'm a fake link</a>
```

Instead, you should write the template as:

```hbs
<a href="https://alink.com">I'm a real link</a>
```

The following values are valid configuration:

  * boolean -- `true` for enabled / `false` for disabled
