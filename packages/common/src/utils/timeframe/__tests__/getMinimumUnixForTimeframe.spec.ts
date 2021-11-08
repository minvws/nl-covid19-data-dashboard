import { suite } from 'uvu';
import { getMinimumUnixForTimeframe } from '..';
import * as assert from 'uvu/assert';

const GetMinimumUnixForTimeframe = suite('getMinimumUnixForTimeframe');

GetMinimumUnixForTimeframe('should return zero for all', () => {
  assert.is(getMinimumUnixForTimeframe('all', new Date()), 0);
});

GetMinimumUnixForTimeframe('should return greater than zero for 5weeks', () => {
  const result = getMinimumUnixForTimeframe('5weeks', new Date());
  const today = new Date().getTime();
  const secondsDelta = Math.abs(today - result) / 1000;
  const daysDelta = Math.floor(secondsDelta / 86400);

  assert.is(daysDelta, 35);
});

GetMinimumUnixForTimeframe.run();
