# Node API

Run templates through the linter's `verify` method like so:

```js
let TemplateLinter = require('ember-template-lint');

let linter = new TemplateLinter();
let template = fs.readFileSync('some/path/to/template.hbs', {
  encoding: 'utf8',
});
let results = await linter.verify({ source: template, moduleId: 'template.hbs' });
```

`results` will be an array of objects which have the following properties:

- `rule` - The name of the rule that triggered this warning/error.
- `message` - The message that should be output.
- `line` - The line on which the error occurred.
- `column` - The column on which the error occurred.
- `moduleId` - The module path for the file containing the error.
- `source` - The source that caused the error.
- `fix` - An object describing how to fix the error.
