## element-attributes-order

Element attributes must be ordered as:

* arguments
* attributes
* element modifiers
* ...attributes
* ?attributes

### Examples

This rule **forbids** the following:

```hbs
<MyComponent ...attributes @name="Hello" />
```

```hbs
<MyComponent {{did-render this.someAction}} @name="Hello" />
```

```hbs
<MyComponent ...attributes {{did-render this.someAction}} />
```

This rule **allows** the following:

```hbs
<MyComponent @name="1" bar="baz" {{did-render this.someAction}} ...attributes aria-role="button" />
<MyComponent @name="1" aria-role="button" />
```

```hbs
<MyComponent @name="1" ...attributes />
<MyComponent @name="1" {{did-render this.someAction}} />
<MyComponent @name="1" bar="baz" />
```

### Migration

(suggest any fast/automated techniques for fixing violations in a large codebase)

* suggestion on how to fix violations using find-and-replace / regexp
* suggestion on how to fix violations using a codemod

### Related Rules

* [related-rule-name1](related-rule-name1.md)
* [related-rule-name2](related-rule-name2.md)

### References

* (link to relevant documentation goes here)
* (link to relevant function spec goes here)
* (link to relevant guide goes here)
