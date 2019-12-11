# Semantic Versioning Policy

## Patch Release

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
* Support for on old ember-template-lint version is dropped.
* An existing rule is changed in it reporting more errors.
* An existing rule is removed.
* An existing option of a rule is removed.
* An existing config is updated.
