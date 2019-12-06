'use strict';

const Linter = require('../../lib/index');

const format = Linter._formatGitHubActionAnnotation;

describe('GitHub Actions Annotations', function() {
  describe('_formatGitHubActionAnnotation', () => {
    test('formats error annotations', () => {
      let output = format('foo', { file: 'bar.hbs', line: 4, col: 5 });
      expect(output).toEqual('::error file=bar.hbs,line=4,col=5::foo');
    });

    test('escapes correctly', () => {
      let output = format('wow!\r\nthis is a multiline\nmessage!!', {
        file: 'semi;colon.hbs',
        line: 4,
        col: 5,
      });

      expect(output).toEqual(
        '::error file=semi%3Bcolon.hbs,line=4,col=5::wow!%0D%0Athis is a multiline%0Amessage!!'
      );
    });
  });
});
