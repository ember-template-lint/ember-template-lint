'use strict';

const expect = require('chai').expect;
const {
  transformTagName,
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
    expect(transformTagName('foo$bar-bang')).to.equal('Foo$BarBang');
    expect(transformTagName('foo$bar-bang::baz::foo3bar')).to.equal('Foo$BarBang::Baz::Foo3bar');
    expect(transformTagName('foo$bar-bang::baz??foo3bar')).to.equal('Foo$BarBang::Baz??Foo3bar');
    expect(transformTagName('foo$bar-bang::baz/foo3bar')).to.equal('Foo$BarBang::Baz::Foo3bar');
  });
});

describe('#isNestedComponentTagName', function() {
  it(`it works as expected`, function() {
    expect(isNestedComponentTagName('nested/my-component')).to.be.true;
    expect(isNestedComponentTagName('my-component')).to.be.false;
  });
});
