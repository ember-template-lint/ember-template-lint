'use strict';

const fs = require('fs');
const path = require('path');
const rules = require('../../lib/rules');

const DEFAULT_CONFIG_PATH = path.join(__dirname, '..', '..', 'lib', 'config');

describe('default configurations', function() {
  let configFiles = fs.readdirSync(DEFAULT_CONFIG_PATH);

  configFiles.forEach(function(file) {
    describe(file, function() {
      it('should contain only valid rules', function() {
        let config = require(path.join(DEFAULT_CONFIG_PATH, file));

        for (let rule in config.rules) {
          expect(rules).toHaveProperty(rule);
        }
      });

      it.skip('should contain only valid rule configuration', function() {
        let config = require(path.join(DEFAULT_CONFIG_PATH, file));

        for (let rule in config.rules) {
          let options = {
            config: config.rules[rule],
          };

          expect(() => new rules[rule](options)).not.toThrow();
        }
      });
    });
  });
});
