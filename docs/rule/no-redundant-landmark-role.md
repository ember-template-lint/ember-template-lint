# no-redundant-landmark-role

If a landmark element is used, any role provided will either be redundant or incorrect.
Add support for landmark elements to ensure that no role attribute is placed on any of
the landmark elements, with a few exceptions.

## Examples

This rule **forbids** the following:

```hbs
<header role="banner"></header>
```

```hbs
<main role="main"></main>
```

```hbs
<aside role="complementary"></aside>
```

```hbs
<nav role="navigation"></nav>
```

This rule **allows** the following:

```hbs
<form role="search"></form>
```

```hbs
<footer role="contentinfo"></footer>
```
