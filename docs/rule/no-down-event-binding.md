# no-down-event-binding

Many browser events have both an "up" and a "down" version that can be listened to (`key{up,down}`, `mouse{up,down}`, etc). For accessibility purposes, it's better to bind to the "up" event. This rule helps guide developers in the right direction by calling out binding to the "down" event.

## Examples

This rule **forbids** the following:

```hbs
<div {{on 'keydown' this.handleKey}}></div>
```

```hbs
<div {{action this.handleKey on='keydown'}}></div>
```

```hbs
<input type="text" onkeydown="handleKeyDown()">
```

This rule **allows** the following:

```hbs
<div {{on 'keyup' this.handleKey}}></div>
```

```hbs
<div {{action this.handleKey on='keyup'}}></div>
```

```hbs
<input type="text" onkeyup="handleKeyUp()">
```

Component arguments are _not_ validated, even if their name looks like the intent might be to register a down event handler.

```hbs
<MyComponent @onKeyDown={{this.handleKeyDown}} />
```

## References

- [WCAG guidelines on using the "down"-event](https://www.w3.org/WAI/WCAG21/Techniques/failures/F101)
