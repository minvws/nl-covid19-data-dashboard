import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getTopicalTileDate, TopicalDateConfig } from '../get-topical-tile-date';

const GetTopicalTileDate = suite('getThresholdValue');

const dateConfigArray: TopicalDateConfig[] = [
  { config: { isoWeekOffset: 1, startDayOfDate: 1, timeSpanInDays: 7 }, inputDate: new Date(1675162800000) },
  { config: { isoWeekOffset: 0, startDayOfDate: 6, timeSpanInDays: 1 }, inputDate: new Date(1669978800000) },
  { config: { isoWeekOffset: 2, startDayOfDate: 3, timeSpanInDays: 14 }, inputDate: new Date(1665568800000) },
];

GetTopicalTileDate('Should retrieve the formated date for the 1st config', () => {
  // 'Current Day' Tuesday 2023-01-31 => 1675162800
  // Week before Monday 23-01-23 => 1674471600
  // The duration of 7 days: Sunday 23-01-29 -> 1674990000
  // Result formated time: '23 - 29 January 2023'
  const expectedResult = { date_start_unix: 1674471600, date_end_unix: 1674990000 };

  const result = getTopicalTileDate(dateConfigArray[0]);
  assert.is(result, expectedResult);
});

GetTopicalTileDate('Should retrieve the formated date for the 2nd config', () => {
  // 'Current Day' Friday 2022-12-02 => 1669978800
  // ISO week offset 0 -> Saturday yet to come, so take the previous one 22-11-26 => 1669460400
  // The duration of 1 day: still Saturday 22-11-26 -> 1669460400
  // Result formated time: '26 November 2022'
  const expectedResult = { date_unix: 1669460400 };

  const result = getTopicalTileDate(dateConfigArray[1]);
  assert.is(result, expectedResult);
});

GetTopicalTileDate('Should retrieve the formated date for the 3rd config', () => {
  // 'Current Day' Friday 2022-10-12 => 1665568800
  // Two weeks before 22-09-28 => 1664359200
  // The duration of 14 days 22-10-12 -> 1665568800
  // Result formated time: '28 september - 12 October 2022'
  const expectedResult = { date_start_unix: 1664359200, date_end_unix: 1665568800 };

  const result = getTopicalTileDate(dateConfigArray[2]);
  assert.is(result, expectedResult);
});

GetTopicalTileDate.run();
