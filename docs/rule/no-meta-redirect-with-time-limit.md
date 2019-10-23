## (no-meta-redirect-with-time-limit)

Sometimes a page automatically redirects to a different page. When this happens after a timed delay, it is an unexpected change of context that may interrupt the user. Redirects without timed delays are okay, but pleasae consider a server-side method for redirecting instead (method will vary based on your server type).

This rule checks for the meta tag with a redirect; if it exists, it checks for a timed delay greater than 0.

### Examples

This rule **forbids** the following:

```hbs
<meta http-equiv="refresh" content="5; url=http://www.example.com" />
```

This rule **allows** the following:

```hbs
<meta http-equiv="refresh" content="0; url=http://www.example.com" />
```

### Migration

* To fix, reduce the timed delay to zero, or use the appropriate server-side redirect method for your server type.

### References

* [F40: Failure due to using meta redirect with a time limit](https://www.w3.org/WAI/WCAG21/Techniques/failures/F40)
* [Success Criterion 2.2.1: Timing Adjustable](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable)
* [Success Criterion 2.2.4: Interruptions](https://www.w3.org/WAI/WCAG21/Understanding/interruptions)
* [Success Criterion 3.2.5: Change on Request](https://www.w3.org/WAI/WCAG21/Understanding/change-on-request)
