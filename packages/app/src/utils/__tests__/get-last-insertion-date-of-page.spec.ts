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
      "booster_shot_administered": { last_value: { date_of_insertion_unix: 123 } },
      "behavior": { last_value: { date_of_insertion_unix: 12345 } },
    },
    ['booster_shot_administered', 'behavior']
  );
  assert.is(result, 12345);
});

GetLastInsertionDateOfPage('returns the max date_of_insertion_unix without last_value', () => {
  const result = getLastInsertionDateOfPage(
    {
      "booster_coverage": { values: [{ date_of_insertion_unix: 123 }, { date_of_insertion_unix: 12345 }] },
    },
    ['booster_coverage']
  );
  assert.is(result, 12345);
});

GetLastInsertionDateOfPage(
  'works with nested values',
  () => {
    const result = getLastInsertionDateOfPage(
      {
        "booster_shot_administered": { last_value: { date_of_insertion_unix: 1 } },
        "variants": { values: [{last_value: { date_of_insertion_unix: 123 }}]},
      },
      ['booster_shot_administered', 'variants']
    );
    assert.is(result, 123);
  }
);

GetLastInsertionDateOfPage(
  'works with a direct path instead of date_of_insertion_unix when given',
  () => {
    const result = getLastInsertionDateOfPage(
      {
        "behavior_per_age_group": {
          "date_of_insertion_unix": 123}
      },
      ['behavior_per_age_group']
    );
    assert.is(result, 123);
  }
);

GetLastInsertionDateOfPage.run();
