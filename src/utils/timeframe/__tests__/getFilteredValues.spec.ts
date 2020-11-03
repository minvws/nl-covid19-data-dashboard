import { getFilteredValues } from '..';

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

describe('Utils: getFilteredValues', () => {
  let _testList: any[];

  beforeEach(() => {
    _testList = createTestValues();
  });

  it('should filter the list by week', () => {
    const result = getFilteredValues(_testList, 'week', testCallback);

    expect(result.length).toEqual(2);
  });

  it('should filter the list by 5weeks', () => {
    const result = getFilteredValues(_testList, '5weeks', testCallback);

    expect(result.length).toEqual(4);
  });

  it('should filter the list by all', () => {
    const result = getFilteredValues(_testList, 'all', testCallback);

    expect(result.length).toEqual(5);
  });
});
