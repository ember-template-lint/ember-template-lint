var assert = require('power-assert');
var parse = require('htmlbars/dist/cjs/htmlbars-syntax').parse;
var isInteractiveElement = require('../../lib/helpers/is-interactive-element');

describe('isInteractiveElement', function() {
  function testTemplate(template, expectedValue) {
    it('isInteractiveElement(`' + template + '` should be ' + expectedValue, function() {
      var ast = parse(template);

      var interactive = isInteractiveElement(ast.body[0]);

      assert(interactive === expectedValue);
    });
  }

  function testReason(template, expectedReason) {
    it('isInteractiveElement.reason(`' + template + '` should be `' + expectedReason+ '`', function() {
      var ast = parse(template);

      var reason = isInteractiveElement.reason(ast.body[0]);

      assert(reason === expectedReason);
    });
  }

  var nonInteractive = [
    '<a></a>',
    '<input type="hidden">',
    '<img>',
    '<div></div>'
  ];

  var interactive = {
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
    '<div tabindex=1></div>': 'an element with the `tabindex` attribute'
  };

  nonInteractive.forEach(function(template) {
    testTemplate(template, false);
  });

  (function() {
    for (var template in interactive) {
      testTemplate(template, true);
    }
  })();

  describe('reason', function() {
    function test(template) {
      var ast = parse(template);

      return isInteractiveElement.reason(ast.body[0]);
    }

    nonInteractive.forEach(function(template) {
      it(template + ' should have a reason of `null`', function() {
        assert(test(template) === null);
      });
    });

    (function() {
      for (var template in interactive) {
        testReason(template, interactive[template]);
      }
    })();
  });
});
