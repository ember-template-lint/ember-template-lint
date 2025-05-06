/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable n/no-unsupported-features/node-builtins */
import fs from 'node:fs';

/*
 *
 * This is replacement for HUGE language-tags dependency
 *
 */

const indexRequest = await fetch(
  'https://raw.githubusercontent.com/mattcg/language-subtag-registry/refs/heads/master/data/json/index.json'
);
const registryRequest = await fetch(
  'https://raw.githubusercontent.com/mattcg/language-subtag-registry/refs/heads/master/data/json/registry.json'
);
const indexData = await indexRequest.json();
const registryData = await registryRequest.json();

const validNames = new Set();
for (const key of Object.keys(indexData)) {
  let registry = registryData.find((el) => el.Subtag === key);
  if (!registry) {
    validNames.add(key);
  } else if (registry['Preferred-Value']) {
    validNames.add(registry['Preferred-Value']);
  } else if (registry['Type'] === 'variant') {
    if (registry['Prefix'] && registry['Prefix'].length === 1) {
      validNames.add(registry['Prefix'][0]);
    } else {
      validNames.add(key);
    }
  }
}

const codes = [...new Set([...validNames].map((e) => e.toLowerCase()))].sort();

fs.writeFileSync(
  '../lib/helpers/country-codes.js',
  `const codes = ${JSON.stringify(codes, null, 2).replaceAll('"', `'`)};\nexport default codes;\n`
);
