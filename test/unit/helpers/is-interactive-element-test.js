'use strict';

const expect = require('chai').expect;
const preprocess = require('./parse');
const isInteractiveElement = require('../../../lib/helpers/is-interactive-element');

describe('isInteractiveElement', function() {
  function testTemplate(template, expectedValue) {
    it(`isInteractiveElement(\`${template}\` should be ${expectedValue}`, function() {
      let ast = preprocess(template);

      let interactive = isInteractiveElement(ast.body[0]);

      expect(interactive).to.equal(expectedValue);
    });
  }

  function testReason(template, expectedReason) {
    it(`isInteractiveElement.reason(\`${template}\` should be \`${expectedReason}\``, function() {
      let ast = preprocess(template);

      let reason = isInteractiveElement.reason(ast.body[0]);

      expect(reason).to.equal(expectedReason);
    });
  }

  let nonInteractive = [
    '<a></a>',
    '<input type="hidden">',
    '<img>',
    '<div></div>'
  ];

  let interactive = {
    '<a href="derp">Link</a>': 'an <a> element with the `href` attribute',
    '<button>Derp</button>': '<button>',
    '<details></details>': '<details>',
    '<embed>': '<embed>',
    '<iframe></iframe>': '<iframe>',
    '<input>': '<input>',
    '<select></select>': '<select>',
    '<textarea></textarea>': '<textarea>',
    '<img usemap="#foo">': 'an <img> element with the `usemap` attribute',
    '<object usemap="#foo"></object>': 'an <object> element with the `usemap` attribute',
    '<div tabindex=1></div>': 'an element with the `tabindex` attribute',
    '<label></label>': '<label>',
    '<div role="button"></div>': 'an element with `role="button"`',
    '<div role="textbox"></div>': 'an element with `role="textbox"`'
  };

  nonInteractive.forEach(function(template) {
    testTemplate(template, false);
  });

  (function() {
    for (let template in interactive) {
      testTemplate(template, true);
    }
  })();

  describe('reason', function() {
    function test(template) {
      let ast = preprocess(template);

      return isInteractiveElement.reason(ast.body[0]);
    }

    nonInteractive.forEach(function(template) {
      it(`${template} should have a reason of \`null\``, function() {
        expect(test(template)).to.be.null;
      });
    });

    (function() {
      for (let template in interactive) {
        testReason(template, interactive[template]);
      }
    })();
  });
});
