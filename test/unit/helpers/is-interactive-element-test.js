'use strict';

const { parse } = require('ember-template-recast');

const isInteractiveElement = require('../../../lib/helpers/is-interactive-element');

describe('isInteractiveElement', function () {
  function testTemplate(template, expectedValue) {
    it(`isInteractiveElement(\`${template}\` should be ${expectedValue}`, function () {
      let ast = parse(template);

      let interactive = isInteractiveElement(ast.body[0]);

      expect(interactive).toEqual(expectedValue);
    });
  }

  function testReason(template, expectedReason) {
    it(`isInteractiveElement.reason(\`${template}\` should be \`${expectedReason}\``, function () {
      let ast = parse(template);

      let reason = isInteractiveElement.reason(ast.body[0]);

      expect(reason).toEqual(expectedReason);
    });
  }

  let nonInteractive = [
    '<input type="hidden">',
    '<img>',
    '<div></div>',
    '<div tabindex=1></div>',
    '<div role="button"></div>',
    '<canvas></canvas>',
  ];

  let interactive = {
    '<a href="derp">Link</a>': '<a>',
    '<button>Derp</button>': '<button>',
    '<details></details>': '<details>',
    '<embed>': '<embed>',
    '<iframe></iframe>': '<iframe>',
    '<input>': '<input>',
    '<select></select>': '<select>',
    '<textarea></textarea>': '<textarea>',
    '<img usemap="#foo">': 'an <img> element with the `usemap` attribute',
    '<object usemap="#foo"></object>': 'an <object> element with the `usemap` attribute',
    '<label></label>': '<label>',
    '<div role="button" tabindex></div>':
      'an element with `role="button"` and `tabindex` attribute',
    '<div role="textbox" tabindex></div>':
      'an element with `role="textbox"` and `tabindex` attribute',
    '<video controls></video>': 'an <video> element with the `controls` attribute',
    '<audio controls></audio>': 'an <audio> element with the `controls` attribute',
  };

  nonInteractive.forEach(function (template) {
    testTemplate(template, false);
  });

  // eslint-disable-next-line wrap-iife
  (function () {
    for (let template in interactive) {
      testTemplate(template, true);
    }
  })();

  describe('reason', function () {
    function test(template) {
      let ast = parse(template);

      return isInteractiveElement.reason(ast.body[0]);
    }

    nonInteractive.forEach(function (template) {
      it(`${template} should have a reason of \`null\``, function () {
        expect(test(template)).toBe(null);
      });
    });

    // eslint-disable-next-line wrap-iife
    (function () {
      for (let template in interactive) {
        testReason(template, interactive[template]);
      }
    })();
  });
});
