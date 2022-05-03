import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-media-caption',

  config: true,

  good: [
    '<video><track kind="captions" /></video>',
    '<audio muted="true"></audio>',
    '<video muted></video>',
    '<audio muted={{this.muted}}></audio>',
    '<video><track kind="captions" /><track kind="descriptions" /></video>',
  ],

  bad: [
    {
      template: '<video></video>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<video></video>",
            },
          ]
        `);
      },
    },
    {
      template: '<audio><track /></audio>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<audio><track /></audio>",
            },
          ]
        `);
      },
    },
    {
      template: '<video><track kind="subtitles" /></video>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<video><track kind=\\"subtitles\\" /></video>",
            },
          ]
        `);
      },
    },
    {
      template: '<audio muted="false"></audio>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<audio muted=\\"false\\"></audio>",
            },
          ]
        `);
      },
    },
    {
      template: '<audio muted="false"><track kind="descriptions" /></audio>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 58,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<audio muted=\\"false\\"><track kind=\\"descriptions\\" /></audio>",
            },
          ]
        `);
      },
    },
    {
      template: '<video muted=false></video>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Media elements such as <audio> and <video> must have a <track> for captions.",
              "rule": "require-media-caption",
              "severity": 2,
              "source": "<video muted=false></video>",
            },
          ]
        `);
      },
    },
  ],
});
