'use strict';

const {
  transformTagName,
  isNestedComponentTagName,
} = require('../../../lib/helpers/curly-component-invocation');

describe('#transformTagName', function() {
  it('it works as expected', function() {
    expect(transformTagName('foo')).toEqual('Foo');
    expect(transformTagName('foo-bar')).toEqual('FooBar');
    expect(transformTagName('Foo-Bar')).toEqual('FooBar');
    expect(transformTagName('f3-bar')).toEqual('F3Bar');
    expect(transformTagName('foo3-bar')).toEqual('Foo3Bar');
    expect(transformTagName('foo3bar-baz')).toEqual('Foo3barBaz');
    expect(transformTagName('foo-b3ar')).toEqual('FooB3ar');
    expect(transformTagName('x-blah')).toEqual('XBlah');
    expect(transformTagName('foo@bar-baz')).toEqual('Foo@BarBaz');
    expect(transformTagName('foo/bar-baz')).toEqual('Foo::BarBaz');
    expect(transformTagName('foo/bar-baz/bang')).toEqual('Foo::BarBaz::Bang');
    expect(transformTagName('foo$bar-bang')).toEqual('Foo$BarBang');
    expect(transformTagName('foo$bar-bang::baz::foo3bar')).toEqual('Foo$BarBang::Baz::Foo3bar');
    expect(transformTagName('foo$bar-bang::baz??foo3bar')).toEqual('Foo$BarBang::Baz??Foo3bar');
    expect(transformTagName('foo$bar-bang::baz/foo3bar')).toEqual('Foo$BarBang::Baz::Foo3bar');
  });
});

describe('#isNestedComponentTagName', function() {
  it('it works as expected', function() {
    expect(isNestedComponentTagName('nested/my-component')).toBe(true);
    expect(isNestedComponentTagName('my-component')).toBe(false);
  });
});
