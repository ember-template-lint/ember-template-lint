## no-unnecessary-concat

This rule forbids unnecessary use of ` " ` when wrapping `concat` instances or use of `{{some.value}}` hbs.

The following code will throw an error:

```hbs
<span class="{{if errors.length 'text-danger' 'text-grey'}}">

<img src="{{customSrc}}" alt="{{customAlt}}">

<label for="{{concat elementId "-date"}}">

{{radio-button
  groupValue=selectedFilter
  radioId=(concat "filter-" i)
  radioClass="custom-control-input"
}}
```
The following code will be accepted:

```hbs
<span class={{if errors.length 'text-danger' 'text-grey'}}>

<img src={{customSrc}} alt={{customAlt}}>

<label for={{concat elementId "-date"}}>

{{radio-button
  groupValue=selectedFilter
  radioId=(concat "filter-" i)
  radioClass="custom-control-input"
}}
```
