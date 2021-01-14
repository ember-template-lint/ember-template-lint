'use strict';

class DefaultPrinter {
  constructor(options = {}) {
    this.delegates = [];

    if (options.json) {
      let JsonPrinter = require('./json');
      this.delegates.push(new JsonPrinter(options));
    } else {
      let PrettyPrinter = require('./pretty');
      this.delegates.push(new PrettyPrinter(options));
    }
  }

  print(results, todoInfo) {
    for (let delegate of this.delegates) {
      delegate.print(results, todoInfo);
    }
  }
}

module.exports = DefaultPrinter;
