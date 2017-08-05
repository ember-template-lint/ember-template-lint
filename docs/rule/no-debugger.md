## no-debugger

`{{debugger}}` will inject `debugger` statement into compiled template code and will pause its rendering if developer tools are open. That is undesirable in a production environment.

This rule forbids usage of the following:

```hbs
{{debugger}}
```
