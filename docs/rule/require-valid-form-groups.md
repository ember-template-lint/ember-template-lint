# require-valid-form-groups

This rule requires appropriate semantics for grouped form controls. Correctly grouped form controls will take one of two approaches:

* use `<fieldset>` + `<legend>` (preferred)
* associate controls using WAI-ARIA (also acceptable)

## Examples

This rule **forbids** the following:

```hbs
<div>
  <label for="radio-001">Chicago Zoey</label>
  <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
  <label for="radio-002">Office Hours Tomster</label>
  <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster" />
  <label for="radio-003">A11y Zoey</label>
  <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey" />
</div>
```

This rule **allows** the following:

```hbs
<div>
  <label for="radio-001">Chicago Zoey</label>
  <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
  <label for="radio-002">Office Hours Tomster</label>
  <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster" />
  <label for="radio-003">A11y Zoey</label>
  <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey" />
</div>
```

```hbs
<div role="group" aria-labelledby="preferred-mascot-heading">
  <div id="preferred-mascot-heading">Preferred Mascot Version</legend>
  <label for="radio-001">Chicago Zoey</label>
  <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
  <label for="radio-002">Office Hours Tomster</label>
  <input id="radio-002" type="radio" name="prefMascot-OfficeHoursTomster" value="office hours tomster" />
  <label for="radio-003">A11y Zoey</label>
  <input id="radio-003" type="radio" name="prefMascot-Zoey" value="a11y zoey" />
</div>
```

## References

* [Grouping Controls](https://www.w3.org/WAI/tutorials/forms/grouping/)
* [The Field Set element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
