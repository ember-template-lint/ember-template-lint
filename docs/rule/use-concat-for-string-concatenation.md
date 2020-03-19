# use-concat-for-string-concatenation

This rule requires the usage of `concat` helper to build strings for element attributes, which ideally prevents common formatting errors (i.e. CMD + P + `Format`) with plain concatenation.

## Forbidden

```hbs
<div class="flex-{{if this.show "100" "50"}}"></div>
```

## Allowed

```hbs
<div class={{concat "flex-" (if this.show "100" "50")}}></div>
```

## Configuration

* TODO

## Related Rules

* [no-unnecesarry-concat](no-unnecesary-concat.md)
* [style-concatenation](style-concatenation.md)
