var fs = require('fs');
var walker = require('walker');
var path = require('path');
var TemplateLinter = require('ember-template-lint');

var linter = new TemplateLinter();
var errors = [];

module.exports = function(options) {
  var output = options.console || console;
  walker(options.dir).on('file', function(filePath) {
    if (path.extname(filePath) === '.hbs') {
      var results = linter.verify({
        moduleId: path.relative(options.dir, filePath),
        source: fs.readFileSync(filePath, { encoding: 'utf8' })
      });
      if (results.length > 0) {
        results.forEach(function(result) {
          errors.push(result);
        });
      }
    }
  }).on('end', function() {
    if (errors.length === 0) {
      return;
    }
    errors.forEach(function(error) {
      output.log(error.rule + ':', error.message);
      output.log('(' + error.moduleId + ' @ L' + 'error.line' + ':C' + error.column + '):');
      output.log(error.source);
      if(error.fix) {
        output.log('(FIX):');
        output.log(error.fix.text);
      }
      output.log();
    });
    output.log('=====', errors.length, 'Template Linting Errors');
    process.exit(1);
  });
};
