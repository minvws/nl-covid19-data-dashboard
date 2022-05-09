import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getLastInsertionDateOfPage } from '../get-last-insertion-date-of-page';

const GetLastInsertionDateOfPage = suite('getLastInsertionDateOfPage');

GetLastInsertionDateOfPage('returns zero when data is empty', () => {
  const result = getLastInsertionDateOfPage({}, ['key1']);
  assert.is(result, 0);
});

GetLastInsertionDateOfPage('returns zero when metrics are empty', () => {
  const result = getLastInsertionDateOfPage(
    { key1: { last_value: { date_of_insertion_unix: 123 } } },
    []
  );
  assert.is(result, 0);
});

GetLastInsertionDateOfPage('returns the max date_of_insertion_unix', () => {
  const result = getLastInsertionDateOfPage(
    {
      key1: { last_value: { date_of_insertion_unix: 123 } },
      key2: { last_value: { date_of_insertion_unix: 12345 } },
    },
    ['key1', 'key2']
  );
  assert.is(result, 12345);
});

GetLastInsertionDateOfPage(
  'ignores missing date_of_insertion_unix properties',
  () => {
    const result = getLastInsertionDateOfPage(
      {
        key1: { last_value: { date_of_insertion_unix: 9 } },
        key3: { last_value: {} },
        key2: { last_value: { date_of_insertion_unix: 6 } },
      },
      ['key1', 'key2', 'key3']
    );
    assert.is(result, 9);
  }
);

GetLastInsertionDateOfPage(
  'works with paths and keys as given pageMetrics',
  () => {
    const result = getLastInsertionDateOfPage(
      {
        key1: { last_value: { date_of_insertion_unix: 1 } },
        level1: {
          level2: {
            last_value: {
              date_of_insertion_unix: 9999,
            },
          },
        },
      },
      ['key1', 'level1.level2']
    );
    assert.is(result, 9999);
  }
);

GetLastInsertionDateOfPage(
  'works with a direct path instead of date_of_insertion_unix when given',
  () => {
    const result = getLastInsertionDateOfPage(
      {
        key1: { last_value: { date_of_insertion_unix: 1 } },
        level1: {
          level2: 123,
        },
      },
      ['key1', 'level1.level2']
    );
    assert.is(result, 123);
  }
);

GetLastInsertionDateOfPage.run();
