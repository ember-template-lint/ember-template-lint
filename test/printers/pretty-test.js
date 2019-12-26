const chalk = require('chalk');
const Printer = require('../../lib/printers/pretty');

describe('Linter.errorsToMessages', function() {
  beforeEach(() => {
    chalk.enabled = false;
  });

  it('formats error with rule, message and moduleId', function() {
    let result = Printer.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message' },
    ]);

    expect(result).toEqual('file/path\n' + '  -:-  error  some message  some rule\n');
  });

  it('formats error with rule, message, line and column numbers even when they are "falsey"', function() {
    let result = Printer.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 1, column: 0 },
    ]);

    expect(result).toEqual('file/path\n' + '  1:0  error  some message  some rule\n');
  });

  it('formats error with rule, message, line and column numbers', function() {
    let result = Printer.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 11, column: 12 },
    ]);

    expect(result).toEqual('file/path\n' + '  11:12  error  some message  some rule\n');
  });

  it('formats error with rule, message, source', function() {
    let result = Printer.errorsToMessages(
      'file/path',
      [{ rule: 'some rule', message: 'some message', source: 'some source' }],
      { verbose: true }
    );

    expect(result).toEqual(
      'file/path\n' + '  -:-  error  some message  some rule\n' + 'some source\n'
    );
  });

  it('formats more than one error', function() {
    let result = Printer.errorsToMessages('file/path', [
      { rule: 'some rule', message: 'some message', line: 11, column: 12 },
      {
        rule: 'some rule2',
        message: 'some message2',
        moduleId: 'some moduleId2',
        source: 'some source2',
      },
    ]);

    expect(result).toEqual(
      'file/path\n' +
        '  11:12  error  some message  some rule\n' +
        '  -:-  error  some message2  some rule2\n'
    );
  });

  it('formats empty errors', function() {
    let result = Printer.errorsToMessages('file/path', []);

    expect(result).toEqual('');
  });
});
