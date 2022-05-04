import { DAY_IN_SECONDS } from '@corona-dashboard/common';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getBoundaryDateStartUnix } from '../get-boundary-date-start-unix';

const GetBoundaryDateStartUnix = suite('getBoundaryDateStartUnix');

GetBoundaryDateStartUnix(
  'should return the start date for a timespan numberOfItems from the end of a range of date values',
  () => {
    const values = [
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
    ];

    const numberOfItems = 3;

    const result = getBoundaryDateStartUnix(values, numberOfItems);

    assert.is(result, values[values.length - numberOfItems].date_unix);
  }
);

GetBoundaryDateStartUnix(
  'should return the start date for a timespan numberOfItems from the end of a range of date span values',
  () => {
    const values = [
      { date_start_unix: Date.now() / 1000, date_end_unix: Date.now() / 1000 },
      { date_start_unix: Date.now() / 1000, date_end_unix: Date.now() / 1000 },
      { date_start_unix: Date.now() / 1000, date_end_unix: Date.now() / 1000 },
      { date_start_unix: Date.now() / 1000, date_end_unix: Date.now() / 1000 },
      { date_start_unix: Date.now() / 1000, date_end_unix: Date.now() / 1000 },
    ];

    const numberOfItems = 3;

    const result = getBoundaryDateStartUnix(values, numberOfItems);

    assert.is(result, values[values.length - numberOfItems].date_start_unix);
  }
);

GetBoundaryDateStartUnix(
  'should return Infinity when numberOfItems is larger then values.length',
  () => {
    const values = [
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
    ];

    const numberOfItems = values.length + 1;

    const result = getBoundaryDateStartUnix(values, numberOfItems);

    assert.is(result, Infinity);
  }
);

GetBoundaryDateStartUnix(
  'should return the last date_unix when numberOfItems is zero',
  () => {
    const values = [
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
      { date_unix: Date.now() / 1000 },
    ];

    const numberOfItems = 0;

    const result = getBoundaryDateStartUnix(values, numberOfItems);

    assert.is(result, values[values.length - 1].date_unix - DAY_IN_SECONDS / 2);
  }
);

GetBoundaryDateStartUnix.run();
