import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getLastInsertionDateOfPage } from '../get-last-insertion-date-of-page';

const GetLastDateOfInsertion = suite('getLastInsertionDateOfPage');

GetLastDateOfInsertion('returns zero when data is empty', () => {
  const result = getLastInsertionDateOfPage({}, ['key1']);
  assert.is(result, 0);
});

GetLastDateOfInsertion('returns zero when metrics are empty', () => {
  const result = getLastInsertionDateOfPage(
    { key1: { last_value: { date_of_insertion_unix: 123 } } },
    []
  );
  assert.is(result, 0);
});

GetLastDateOfInsertion('returns the max date_of_insertion_unix', () => {
  const result = getLastInsertionDateOfPage(
    {
      key1: { last_value: { date_of_insertion_unix: 123 } },
      key2: { last_value: { date_of_insertion_unix: 12345 } },
    },
    ['key1', 'key2']
  );
  assert.is(result, 12345);
});

GetLastDateOfInsertion('returns the max date_of_insertion_unix without last_value', () => {
  const result = getLastInsertionDateOfPage(
    {
      key1: { values: [{ date_of_insertion_unix: 123 }, { date_of_insertion_unix: 12345 }] },
    },
    ['key1']
  );
  assert.is(result, 12345);
});

GetLastDateOfInsertion('works with nested values', () => {
    const result = getLastInsertionDateOfPage(
      {
        key1: { last_value: { date_of_insertion_unix: 1 } },
        key2: { values: [{last_value: { date_of_insertion_unix: 123 }}]},
      },
      ['key1', 'key2']
    );
    assert.is(result, 123);
  }
);

GetLastDateOfInsertion('works with a direct date_of_insertion_unix', () => {
    const result = getLastInsertionDateOfPage(
      {
        key1: { date_of_insertion_unix: 123 }
      },
      ['key1']
    );
    assert.is(result, 123);
  }
);

GetLastDateOfInsertion.run();
