import { getDaysForTimeframe } from '..';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const GetDaysForTimeframe = suite('getDaysForTimeframe');

GetDaysForTimeframe('should return 35 for 5weeks', () => {
  assert.is(getDaysForTimeframe('5weeks'), 35);
});

GetDaysForTimeframe('should return Infinity for all', () => {
  assert.is(getDaysForTimeframe('all'), Infinity);
});

GetDaysForTimeframe.run();
