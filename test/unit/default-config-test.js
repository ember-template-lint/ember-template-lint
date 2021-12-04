import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import rules from '../../lib/rules/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_CONFIG_PATH = path.join(__dirname, '..', '..', 'lib', 'config');

describe('default configurations', function () {
  let configFiles = fs.readdirSync(DEFAULT_CONFIG_PATH);

  for (const file of configFiles) {
    describe(file, function () {
      it('should contain only valid rules', async function () {
        let { default: config } = await import(path.join(DEFAULT_CONFIG_PATH, file));

        for (let rule in config.rules) {
          expect(rules).toHaveProperty(rule);
        }
      });

      it.skip('should contain only valid rule configuration', async function () {
        let { default: config } = await import(path.join(DEFAULT_CONFIG_PATH, file));

        for (let rule in config.rules) {
          let options = {
            config: config.rules[rule],
          };

          expect(() => new rules[rule](options)).not.toThrow();
        }
      });
    });
  }
});
