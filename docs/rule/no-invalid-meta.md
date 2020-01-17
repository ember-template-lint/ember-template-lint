## no-invalid-meta

This rule checks for these meta tag issues:

- a meta with a redirect- if it exists, it checks for a timed delay greater than 0.
- a meta with a timed refresh- the timed delay should be greater than 72,000 seconds.
- a meta that locks orientation to landscape or portrait view

### Redirects & Refresh
Sometimes a page automatically redirects to a different page. When this happens after a timed delay, it is an unexpected change of context that may interrupt the user. Redirects without timed delays are okay, but please consider a server-side method for redirecting instead (method will vary based on your server type).

### Orientation Lock
When content is presented with a restriction to a specific orientation, users must orient their devices to view the content in the orientation that the author imposed. Some users have their devices mounted in a fixed orientation (e.g. on the arm of a power wheelchair), and if the content cannot be viewed in that orientation it creates problems for the user.

### Examples

This rule **forbids** the following:

```hbs
<meta http-equiv="refresh" content="5; url=http://www.example.com" />
```

```hbs
<meta name="viewport" content="user-scalable=no">
```

```hbs
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
```

This rule **allows** the following:

```hbs
<meta http-equiv="refresh" content="0; url=http://www.example.com" />
```

```hbs
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
```

### Migration

* To fix, reduce the timed delay to zero, or use the appropriate server-side redirect method for your server type.
* To fix orientation issues, remove references to `maximum-scale=1.0` and change `user-scalable=no` to `user-scalable=yes`.

### References

* [HTML meta tag doc](https://www.w3schools.com/tags/tag_meta.asp)
* [F40: Failure due to using meta redirect with a time limit](https://www.w3.org/WAI/WCAG21/Techniques/failures/F40)
* [F41: Failure due to using meta refresh to reload the page](https://www.w3.org/WAI/WCAG21/Techniques/failures/F41)
* [Success Criterion 2.2.1: Timing Adjustable](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable)
* [Success Criterion 2.2.4: Interruptions](https://www.w3.org/WAI/WCAG21/Understanding/interruptions)
* [Success Criterion 3.2.5: Change on Request](https://www.w3.org/WAI/WCAG21/Understanding/change-on-request)
* [Failure due to locking the orientation to landscape or portrait view](https://www.w3.org/WAI/WCAG21/Techniques/failures/F97)
