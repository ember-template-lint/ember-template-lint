import Rule from './_base.js';

function message(name) {
  return `Attribute, ${name}, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. In HTML, all attributes are valid, but 'className' doesn't do anything.`;
}

export default class NoJSXAttributes extends Rule {
  visitor() {
    return {
      AttrNode(path) {
        if (!(path.name === 'className')) {
          return;
        }

        this.log({
          message: message(path.name),
          node: path,
        });
      },
    };
  }
}
