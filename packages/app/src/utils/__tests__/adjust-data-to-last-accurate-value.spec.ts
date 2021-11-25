import { suite } from 'uvu';
import {
  adjustDataToLastAccurateValue,
  isValuesWithLastValue,
} from '../adjust-data-to-last-accurate-value';
import * as assert from 'uvu/assert';

const AdjustDataToLastAccurateValue = suite('adjustDataToLastAccurateValue');

AdjustDataToLastAccurateValue(
  'should return the data unaltered if there are no null values',
  () => {
    const data = {
      values: [{ test: 1 }, { test: 2 }, { test: 3 }],
      last_value: { test: 3 },
    };

    assert.is(adjustDataToLastAccurateValue(data, 'test'), data);
  }
);

AdjustDataToLastAccurateValue(
  'should return the data unaltered if there only null values',
  () => {
    const data = {
      values: [{ test: null }, { test: null }, { test: null }],
      last_value: { test: null },
    };

    assert.is(adjustDataToLastAccurateValue(data, 'test'), data);
  }
);

AdjustDataToLastAccurateValue(
  'should adjust the last_value if there are some null values for objects',
  () => {
    const data = {
      values: [{ test: 1 }, { test: 2 }, { test: null }],
      last_value: { test: null },
    };

    assert.equal(adjustDataToLastAccurateValue(data, 'test'), {
      values: [{ test: 1 }, { test: 2 }, { test: null }],
      last_value: { test: 2 },
    });
  }
);

AdjustDataToLastAccurateValue(
  'should adjust the last_value if there are some null values for values',
  () => {
    const data = {
      values: [1, 2, null],
      last_value: null,
    };

    assert.equal(adjustDataToLastAccurateValue(data), {
      values: [1, 2, null],
      last_value: 2,
    });
  }
);

AdjustDataToLastAccurateValue.run();

const IsValuesWithLastValue = suite('isValuesWithLastValue');

IsValuesWithLastValue(
  'checks if the parameter is an object with values and last_value keys',
  () => {
    assert.ok(isValuesWithLastValue({ values: [], last_value: '' }));
    assert.not.ok(isValuesWithLastValue({ values: [] }));
    assert.not.ok(isValuesWithLastValue({ last_value: '' }));
    assert.not.ok(isValuesWithLastValue({}));
    assert.not.ok(isValuesWithLastValue([]));
    assert.not.ok(isValuesWithLastValue(''));
    assert.not.ok(isValuesWithLastValue(1));
    assert.not.ok(isValuesWithLastValue(undefined));
  }
);

IsValuesWithLastValue.run();
