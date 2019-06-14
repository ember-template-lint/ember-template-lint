'use strict';

/*
 Disallows childless elements

 ```
{{! good }}
<h1>something</h1>
<h2>something</h2>
<h3>something</h3>
<h4>something</h4>
<h5>something</h5>
<h6>something</h6>
<p>something</p>
<span>something</span>
<a>something</a>
<ul>something</ul>
<ol>something</ol>
<li>something</li>
<div>something</div>

{{! bad}}
<h1></h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>
<p></p>
<span></span>
<a></a>
<ul></ul>
<ol></ol>
<li></li>
<div></div>
 ```

The following values are valid configuration:
* boolean -- `true` for enabled / `false` for disabled

*/

const Rule = require('./base');

const BLOCK_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'ul', 'ol', 'li', 'div'];
const ERROR_MESSAGE = 'Empty non-void elements are not allowed';

module.exports = class NoChildlessElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const isNonVoidTag = BLOCK_TAGS.includes(node.tag);
        const isElementEmpty = !node.children.length;
        const shouldDisplayMessage = isNonVoidTag && isElementEmpty;

        if (shouldDisplayMessage) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc.start.line,
            column: node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.BLOCK_TAGS = BLOCK_TAGS;
module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
