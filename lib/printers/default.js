'use strict';

class DefaultPrinter {
  constructor(options = {}) {
    this.delegates = [];

    this.delegates.push(options.formatter);
  }

  print(results, todoInfo) {
    for (let delegate of this.delegates) {
      delegate.print(results, todoInfo);
    }
  }
}

module.exports = DefaultPrinter;
