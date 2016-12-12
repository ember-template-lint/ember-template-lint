const fs = require('fs');
const walker = require('walker');
const path = require('path');
const TemplateLinter = require('ember-template-lint');

const linter = new TemplateLinter();
const errors = [];

module.exports = function(options) {
  walker(options.dir).on('file', (filePath) => {
    if (path.extname(filePath) === '.hbs') {
      const result = linter.verify({
        moduleId: path.relative(options.dir, filePath),
        source: fs.readFileSync(filePath, { encoding: 'utf8' }),
      });
      if (result.length > 0) {
        errors.push(...result);
      }
    }
  }).on('end', () => {
    if (errors.length === 0) {
      return;
    }
    errors.forEach((error) => {
      console.log(`${error.rule}:`, error.message);
      console.log(`(${error.moduleId} @ L${error.line}:C${error.column}):`);
      console.log(error.source);
      if(error.fix) {
        console.log('(FIX):');
        console.log(error.fix.text);
      }
      console.log();
    });
    console.log(`===== ${errors.length} Template Linting Errors`);
    process.exit(1);
  });
}
