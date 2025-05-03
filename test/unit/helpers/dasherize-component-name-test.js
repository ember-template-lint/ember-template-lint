import dasherizeComponentName from '../../../lib/helpers/dasherize-component-name.js';

describe('dasherizeComponentName', function () {
  it('works as expected', function () {
    expect(dasherizeComponentName('foo')).toEqual('foo');
    expect(dasherizeComponentName('foo-bar')).toEqual('foo-bar');
    expect(dasherizeComponentName('FooBar')).toEqual('foo-bar');
    expect(dasherizeComponentName('foo/bar-baz')).toEqual('foo/bar-baz');
    expect(dasherizeComponentName('Foo::BarBaz')).toEqual('foo/bar-baz');
    expect(dasherizeComponentName('foo/bar-baz/bang')).toEqual('foo/bar-baz/bang');
    expect(dasherizeComponentName('Foo::BarBaz::Bang')).toEqual('foo/bar-baz/bang');
  });
});
