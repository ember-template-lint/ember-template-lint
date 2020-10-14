# Semantic Versioning Policy

`ember-template-lint` follows [semantic versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

For clarity, we define semver policy for this addon in two parts- as related to **rules** and as related to **config** files.

## Related to Rules

### Patch Release

A patch release should not break your lint build.

* A bug fix in a rule that results in it reporting fewer errors.
* Improvements to documentation.
* Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
* Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).

### Minor Release

A minor release may break your lint build in some cases.

* A bug fix in a rule that results in it reporting more errors.
* A new rule is created.
* A new option to an existing rule is created.
* An existing rule is deprecated.

### Major Release

A major release is likely to break your lint build.

* Support for an old Node version is dropped.
* An existing rule is changed in it reporting more errors.
* An existing rule is removed.
* An existing option of a rule is removed.

## Config Files

### Patch or Minor Release

A patch or minor release should not break your lint build.

* Removing a rule
* Making a rule less restrictive

### Major Releases

A major release is likely to break your lint build.

* Adding new rules in a config set
* Making a rule more restrictive

## Exemptions

There are some files that are intended to be used for special purposes and as such are exempt from this versioning policy.

Exemption list:

* [a11y](../lib/config/a11y.js) - this config file was created to help in instances where an a11y-specific linting audit of a codebase is desired. This is excluded from the normal SemVer guarantees as we expect it to always be the "canonical reference" for the A11Y related rules in the codebase.
