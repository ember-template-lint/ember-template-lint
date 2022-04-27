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
      result: {
        message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        line: 1,
        column: 0,
        source: '<video></video>',
      },
    },
    {
      template: '<audio><track /></audio>',
      result: {
        message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        line: 1,
        column: 0,
        source: '<audio><track /></audio>',
      },
    },
    {
      template: '<video><track kind="subtitles" /></video>',
      result: {
        message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        line: 1,
        column: 0,
        source: '<video><track kind="subtitles" /></video>',
      },
    },
    {
      template: '<audio muted="false"></audio>',
      result: {
        message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        line: 1,
        column: 0,
        source: '<audio muted="false"></audio>',
      },
    },
    {
      template: '<audio muted="false"><track kind="descriptions" /></audio>',
      result: {
        message: 'Media elements such as <audio> and <video> must have a <track> for captions.',
        line: 1,
        column: 0,
        source: '<audio muted="false"><track kind="descriptions" /></audio>',
      },
    },
  ],
});
