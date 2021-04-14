# linebreak-style

:nail_care: The `extends: 'stylistic'` property in a configuration file enables this rule.

Having consistent linebreaks is important to make sure that the source code is rendered correctly in editors.

## Examples

N/A

## Configuration

This rule is configured with a boolean, or a string value:

* boolean -- `true` for enforcing consistency (all `CRLF` or all `LF` not both in a single file)
* string -- `system` for the current platforms default line ending / `unix` for LF linebreaks / `windows` for CRLF linebreaks

If `.editorconfig` file present, rule configuration will be inherit from it.

## Related Rules

* [eslint/linebreak-style](https://eslint.org/docs/rules/linebreak-style)

## References

* [Git/line endings](https://docs.github.com/en/github/using-git/configuring-git-to-handle-line-endings)
