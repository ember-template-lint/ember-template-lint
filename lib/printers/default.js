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

    if (process.env.GITHUB_ACTIONS && !process.env.DISABLE_GITHUB_ACTIONS_ANNOTATIONS) {
      let GitHubActionsPrinter = require('./github-actions');
      this.delegates.push(new GitHubActionsPrinter(options));
    }
  }

  print(results) {
    for (let delegate of this.delegates) {
      delegate.print(results);
    }
  }
}

module.exports = DefaultPrinter;
