import fs from 'node:fs';

const FILE_PATTERN = /Report\swrit{2}en\sto\s(.*\..*)/;

export default function getOutputFileContents(output) {
  let match = output.match(FILE_PATTERN);
  let contents = fs.readFileSync(match[1], { encoding: 'utf-8' });

  return contents;
}
