import { suite } from 'uvu';
import { getFilteredValues } from '..';
import * as assert from 'uvu/assert';

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

function createTestDate(numberOfDays: number): Date {
  return new Date(new Date().getTime() - numberOfDays * oneDayInMilliseconds);
}

type TestValue = {
  date: Date;
};

function createTestValues(): TestValue[] {
  const testValueList = [
    {
      date: createTestDate(1),
    },
    {
      date: createTestDate(2),
    },
    {
      date: createTestDate(9),
    },
    {
      date: createTestDate(12),
    },
    {
      date: createTestDate(60),
    },
  ];

  return testValueList;
}

const testCallback = (item: TestValue) => item.date.getTime();

const GetFilteredValues = suite('getFilteredValues');

GetFilteredValues.before((context) => {
  context._testList = createTestValues();
});

GetFilteredValues.before.each((context) => {
  context._testList = createTestValues();
});

GetFilteredValues('should filter the list by 5weeks', (context) => {
  const result = getFilteredValues(
    context._testList,
    '5weeks',
    new Date(),
    testCallback
  );

  assert.is(result.length, 4);
});

GetFilteredValues('should filter the list by all', (context) => {
  const result = getFilteredValues(
    context._testList,
    'all',
    new Date(),
    testCallback
  );

  assert.is(result.length, 5);
});

GetFilteredValues.run();
