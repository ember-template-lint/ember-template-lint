const fs = require('fs');
const path = require('path');

const format = require('date-fns/format');

const today = new Date();
const DATE_FORMAT = format(today, 'yyyy-MM-dd-HH_mm_ss');
const DEFAULT_OUTPUT_FILENAME = `ember-template-lint-report-${DATE_FORMAT}`;

function writeOutputFile(contents, extension, options) {
  let outputPath = getOutputPath(extension, options);

  fs.writeFileSync(outputPath, contents, { encoding: 'utf-8' });

  return outputPath;
}

function getOutputPath(extension, options) {
  let outputFile = !options.outputFile
    ? `${DEFAULT_OUTPUT_FILENAME}.${extension}`
    : options.outputFile;

  let outputPath = path.isAbsolute(outputFile)
    ? outputFile
    : path.posix.join(options.workingDir, outputFile);

  let dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return outputPath;
}

module.exports = writeOutputFile;
