'use strict';

const expect = require('chai').expect;
const {
  transformTagName,
  isComponentTagName,
  isNestedComponentTagName,
} = require('../../../lib/helpers/curly-component-invocation');

describe('#transformTagName', function() {
  it(`it works as expected`, function() {
    expect(transformTagName('foo')).to.equal('Foo');
    expect(transformTagName('foo-bar')).to.equal('FooBar');
    expect(transformTagName('f3-bar')).to.equal('F3Bar');
    expect(transformTagName('foo3-bar')).to.equal('Foo3Bar');
    expect(transformTagName('foo3bar-baz')).to.equal('Foo3barBaz');
    expect(transformTagName('foo-b3ar')).to.equal('FooB3ar');
    expect(transformTagName('x-blah')).to.equal('XBlah');
    expect(transformTagName('foo@bar-baz')).to.equal('Foo@BarBaz');
    expect(transformTagName('foo/bar-baz')).to.equal('Foo::BarBaz');
    expect(transformTagName('foo/bar-baz/bang')).to.equal('Foo::BarBaz::Bang');
  });
});

describe('#isComponentTagName', function() {
  it(`it works as expected`, function() {
    expect(isComponentTagName('my-component')).to.be.true;
    expect(isComponentTagName(-50)).to.be.false;
    expect(isComponentTagName('-50')).to.be.false;
    expect(isComponentTagName('helper')).to.be.false;
  });
});

describe('#isNestedComponentTagName', function() {
  it(`it works as expected`, function() {
    expect(isNestedComponentTagName('nested/my-component')).to.be.true;
    expect(isNestedComponentTagName('my-component')).to.be.false;
  });
});
