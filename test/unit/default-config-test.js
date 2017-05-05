var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var rules = require('../../lib/rules');

var DEFAULT_CONFIG_PATH = path.join(__dirname, '..', '..', 'lib', 'config');

describe('default configurations', function() {
  var configFiles = fs.readdirSync(DEFAULT_CONFIG_PATH);

  configFiles.forEach(function(file) {
    describe(file, function() {
      it('should contain only valid rules', function() {
        var config = require(path.join(DEFAULT_CONFIG_PATH, file));

        for (var rule in config.rules) {
          expect(rules).to.contain.keys(rule);
        }
      });

      it('should contain only valid rule configuration', function() {
        var config = require(path.join(DEFAULT_CONFIG_PATH, file));

        for (var rule in config.rules) {
          var options = {
            config: config.rules[rule]
          };

          var Rule = rules[rule](options);
          expect(function() {
            new Rule({
              rawSource: ''
            });
          }).to.not.throw;
        }
      });
    });
  });
});
