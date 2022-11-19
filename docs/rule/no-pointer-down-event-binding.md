# no-pointer-down-event-binding

✅ The `extends: 'recommended'` property in a configuration file enables this rule.

Many browser events have both an "up" and a "down" version that can be listened to (`mouse{up,down}`, `pointer{up,down}`, etc). For accessibility purposes, it's better to bind to the "up" event for pointer events. This rule helps guide developers in the right direction by calling out binding to the "mousedown" and "pointerdown" events.

## Examples

This rule **forbids** the following:

```hbs
<div {{on 'mousedown' this.handleMouseDown}}></div>
```

```hbs
<div {{action this.handleMouseDown on='mousedown'}}></div>
```

```hbs
<input type="text" onmousedown="handleMouseDown()">
```

This rule **allows** the following:

```hbs
<div {{on 'mouseup' this.handleMouseUp}}></div>
```

```hbs
<div {{action this.handleMouseUp on='mouseup'}}></div>
```

```hbs
<input type="text" onmouseup="handleMouseUp()">
```

Component arguments are _not_ validated, even if their name looks like the intent might be to register a down event handler.

```hbs
<MyComponent @onMouseDown={{this.handleMouseDown}} />
```

## References

- [WCAG guidelines on using the "down"-event](https://www.w3.org/WAI/WCAG21/Techniques/failures/F101)
