'use strict';

const interpolate = require('../../../lib/helpers/interpolate');

const INPUT_STRING = 'abc <%def%> ghi';

describe('interpolate', function () {
  it('returns the input string if data is empty or missing', function () {
    expect(interpolate(INPUT_STRING, null)).toStrictEqual(INPUT_STRING);
    expect(interpolate(INPUT_STRING, undefined)).toStrictEqual(INPUT_STRING);
    expect(interpolate(INPUT_STRING, { ghi: 'def' })).toStrictEqual(INPUT_STRING);
    expect(interpolate('some text', { ghi: 'def' })).toStrictEqual('some text');
  });
  it('replaces data as expected', function () {
    expect(interpolate(INPUT_STRING, { def: 'def' })).toStrictEqual('abc def ghi');
    expect(interpolate('<<%def%>>', { def: 'def' })).toStrictEqual('<def>');
    expect(interpolate('<%abc%> def <%ghi%>', { abc: 'abc', ghi: 'ghi' })).toStrictEqual(
      'abc def ghi'
    );
  });
});
