const Printer = require('../../lib/printers/junit');

describe('JUnit printer', function() {
  it('formats error with rule, message and moduleId', function() {
    let printer = new Printer();
    let result = printer.format({
      'file/path': [{ rule: 'some rule', message: 'some message' }],
    });

    expect(result).toMatchInlineSnapshot(`
"<?xml version=\\"1.0\\"?>
<testsuite tests=\\"1\\" failures=\\"1\\">
  <testcase name=\\"file/path\\">
    <failure>-:-  some message  some rule</failure>
  </testcase>
</testsuite>"
`);
  });

  it('formats error with rule, message, line and column numbers even when they are "falsey"', function() {
    let printer = new Printer();
    let result = printer.format({
      'file/path': [{ rule: 'some rule', message: 'some message', line: 1, column: 0 }],
    });

    expect(result).toMatchInlineSnapshot(`
"<?xml version=\\"1.0\\"?>
<testsuite tests=\\"1\\" failures=\\"1\\">
  <testcase name=\\"file/path\\">
    <failure>1:0  some message  some rule</failure>
  </testcase>
</testsuite>"
`);
  });

  it('formats error with rule, message, line and column numbers', function() {
    let printer = new Printer();
    let result = printer.format({
      'file/path': [{ rule: 'some rule', message: 'some message', line: 11, column: 12 }],
    });

    expect(result).toMatchInlineSnapshot(`
"<?xml version=\\"1.0\\"?>
<testsuite tests=\\"1\\" failures=\\"1\\">
  <testcase name=\\"file/path\\">
    <failure>11:12  some message  some rule</failure>
  </testcase>
</testsuite>"
`);
  });

  it('formats more than one error', function() {
    let printer = new Printer();
    let result = printer.format({
      'file/path': [
        { rule: 'some rule', message: 'some message', line: 11, column: 12 },
        {
          rule: 'some rule2',
          message: 'some message2',
          moduleId: 'some moduleId2',
          source: 'some source2',
        },
      ],
      'file/other/path': [{ rule: 'some rule', message: 'some message', line: 11, column: 12 }],
      'foo/bar.hbs': false,
      'foo/baz.hbs': [],
    });

    expect(result).toMatchInlineSnapshot(`
"<?xml version=\\"1.0\\"?>
<testsuite tests=\\"4\\" failures=\\"2\\">
  <testcase name=\\"file/path\\">
    <failure>11:12  some message  some rule
-:-  some message2  some rule2</failure>
  </testcase>
  <testcase name=\\"file/other/path\\">
    <failure>11:12  some message  some rule</failure>
  </testcase>
  <testcase name=\\"foo/bar.hbs\\"/>
  <testcase name=\\"foo/baz.hbs\\"/>
</testsuite>"
`);
  });

  it('formats empty errors', function() {
    let printer = new Printer();
    let result = printer.format({ 'file/path': [] });

    expect(result).toMatchInlineSnapshot(`
"<?xml version=\\"1.0\\"?>
<testsuite tests=\\"1\\" failures=\\"0\\">
  <testcase name=\\"file/path\\"/>
</testsuite>"
`);
  });
});
