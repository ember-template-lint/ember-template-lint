import { getPossibleOptionNames } from '../../../lib/helpers/cli.js';

describe('getPossibleOptionNames', function () {
  it('returns correct list of all possible dasherized, camelized, aliased, and negated names', function () {
    const results = getPossibleOptionNames({
      foo: {},
      'foo-bar': {},
      'no-baz': {},
      'no-fizz-sizz': {},
      'option-with-alias': { alias: 'aliased-name' },
    });
    expect(results).toMatchInlineSnapshot(`
      [
        "foo",
        "foo-bar",
        "no-baz",
        "no-fizz-sizz",
        "option-with-alias",
        "aliased-name",
        "foo",
        "fooBar",
        "noBaz",
        "noFizzSizz",
        "optionWithAlias",
        "aliasedName",
        "no-foo",
        "no-foo-bar",
        "baz",
        "fizz-sizz",
        "no-option-with-alias",
        "no-aliased-name",
        "noFoo",
        "noFooBar",
        "baz",
        "fizzSizz",
        "noOptionWithAlias",
        "noAliasedName",
      ]
    `);
  });
});
