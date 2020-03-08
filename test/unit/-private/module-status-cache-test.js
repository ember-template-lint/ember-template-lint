const ModuleStatusCache = require('../../../lib/-private/module-status-cache');

const { getCwd } = require('./../../lib/get-config');

describe('ModuleStatusCache', function () {
  it('Merges the overrides rules with existing rules config', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
      ],
    };

    let expectedRule = {
      foo: 'bar',
      baz: 'bang',
    };
    let actual = new ModuleStatusCache(config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('Returns the correct rules config if overrides is empty/not present', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [],
    };

    // clone to ensure we are not mutating
    let expected = JSON.parse(JSON.stringify(config));

    let actual = new ModuleStatusCache(config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expected.rules);

    delete config.overrides;

    actual = new ModuleStatusCache(config).getConfigForFile('app/templates/foo.hbs');

    expect(actual.rules).toEqual(expected.rules);
  });

  it('Merges the overrides rules from multiple overrides with existing rules config', function () {
    let config = {
      rules: {
        qux: 'blobber',
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
        {
          files: ['**/foo.hbs'],
          rules: {
            foo: 'zomg',
          },
        },
      ],
    };

    let expectedRule = {
      qux: 'blobber',
      foo: 'zomg',
      baz: 'bang',
    };
    let actual = new ModuleStatusCache(config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('returns the correct pendingStatus when the provided moduleId is listed in `pending`', function () {
    let config = {
      pending: ['some/path/here', { moduleId: 'foo/bar/baz', only: ['no-bare-strings'] }],
    };

    let moduleStatusCache = new ModuleStatusCache(config);

    expect(
      moduleStatusCache.getConfigForFile({ moduleId: 'some/path/here' }).pendingStatus
    ).toBeTruthy();
    expect(
      moduleStatusCache.getConfigForFile({ moduleId: 'foo/bar/baz' }).pendingStatus
    ).toBeTruthy();
    expect(
      moduleStatusCache.getConfigForFile({ moduleId: 'some/other/path' }).pendingStatus
    ).toBeFalsy();
  });

  it('matches with absolute paths for modules', function () {
    let config = {
      pending: ['some/path/here', { moduleId: 'foo/bar/baz', only: ['no-bare-strings'] }],
    };

    let moduleStatusCache = new ModuleStatusCache(config);
    expect(
      moduleStatusCache.getConfigForFile({ moduleId: `${getCwd()}/some/path/here` })
        .pendingStatus
    ).toBeTruthy();
    expect(
      moduleStatusCache.getConfigForFile({ moduleId: `${getCwd()}/foo/bar/baz` }).pendingStatus
    ).toBeTruthy();
  });
});
