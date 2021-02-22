import { sortTimeSeriesInDataInPlace } from '../data-sorting';

// Items that should be ignored
const filler = {
  filler1: {},
  filler2: {
    last_value: true,
  },
};

const dateSeriesValues = [
  {
    date_unix: 1582848000,
    admissions_on_date_of_admission: 0,
    admissions_on_date_of_reporting: 0,
  },
  {
    date_unix: 1582934400,
    admissions_on_date_of_admission: 0,
    admissions_on_date_of_reporting: 0,
  },
  {
    date_unix: 1582761600,
    admissions_on_date_of_admission: 0,
    admissions_on_date_of_reporting: 0,
  },
  {
    date_unix: 1582914400,
    admissions_on_date_of_admission: 0,
    admissions_on_date_of_reporting: 0,
  },
];

// This holds the rest of the values in a date series. Currently only holds
// the last_value becuase it is required for a timeSeries to be valid
const dateSeriesRest = {
  last_value: {
    date_unix: 1612828800,
    admissions_on_date_of_admission: 0,
    admissions_on_date_of_reporting: 0,
  },
};

const dateSpanSeriesValues = [
  {
    date_start_unix: 1600646400,
    date_end_unix: 1601164800,
    average: 0.0,
    total_installation_count: 1,
  },
  {
    date_start_unix: 1600041600,
    date_end_unix: 1600560000,
    average: 0.0,
    total_installation_count: 1,
  },
  {
    date_start_unix: 1601251200,
    date_end_unix: 1601769600,
    average: 58.07,
    total_installation_count: 1,
  },
  {
    date_start_unix: 1599436800,
    date_end_unix: 1599955200,
    average: 8.39,
    total_installation_count: 1,
  },
];

// This holds the rest of the values in a date span series. Currently only holds
// the last_value becuase it is required for a timeSeries to be valid
const dateSpanSeriesRest = {
  last_value: {
    date_start_unix: 1612137600,
    date_end_unix: 1612656000,
    average: 178.06,
    total_installation_count: 1,
    date_of_insertion_unix: 1612965967,
  },
};

const sortedData = {
  ...filler,
  dateSeries: {
    ...dateSeriesRest,
    values: [...dateSeriesValues].sort((a, b) => a.date_unix - b.date_unix),
  },
  dateSpanSeries: {
    ...dateSpanSeriesRest,
    values: [...dateSpanSeriesValues].sort(
      (a, b) => a.date_end_unix - b.date_end_unix
    ),
  },
};

describe('Util: sort time series in data in place', () => {
  // Testing to make sure the test data and sorted test data are not referencing the
  // same array of values causing the starting time series data to get sorted as well
  it('Sorted values in test data should not match starting values ', () => {
    expect(dateSeriesValues).not.toStrictEqual(sortedData.dateSeries.values);
    expect(dateSpanSeriesValues).not.toStrictEqual(
      sortedData.dateSpanSeries.values
    );
  });

  it('Should sort valid date and date span series data when all required fields are available ', () => {
    const testData = {
      ...filler,
      dateSeries: { ...dateSeriesRest, values: [...dateSeriesValues] },
      dateSpanSeries: {
        ...dateSpanSeriesRest,
        values: [...dateSpanSeriesValues],
      },
    };

    // Date series values should begin the same
    expect(dateSeriesValues).toStrictEqual(testData.dateSeries.values);
    expect(dateSpanSeriesValues).toStrictEqual(testData.dateSpanSeries.values);

    // Sorting in place
    sortTimeSeriesInDataInPlace(testData);
    expect(sortedData).toStrictEqual(testData);

    // Sorted series values should not equal the original date series values
    // Testing to make sure they are not referencing the same array of values
    expect(dateSeriesValues).not.toStrictEqual(testData.dateSeries.values);
    expect(dateSpanSeriesValues).not.toStrictEqual(
      testData.dateSpanSeries.values
    );
  });

  it('Should throw an error when there are no date_unix in a date series', () => {
    const invalidDateSeries = {
      ...dateSeriesRest,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      values: [...dateSeriesValues].map(({ date_unix, ...rest }) => ({
        ...rest,
      })),
    };
    const invalidTestData = {
      ...filler,
      dateSeries: invalidDateSeries,
      dateSpanSeries: {
        ...dateSpanSeriesRest,
        values: [...dateSpanSeriesValues],
      },
    };

    // Date series values should be different
    expect(dateSeriesValues).not.toStrictEqual(
      invalidTestData.dateSeries.values
    );

    // Sorting in place
    expect(() => sortTimeSeriesInDataInPlace(invalidTestData)).toThrow(Error);
  });

  it('Should throw an error when there are no date_end_unix in a date span series', () => {
    const invalidDateSpanSeries = {
      ...dateSpanSeriesRest,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      values: [...dateSpanSeriesValues].map(({ date_end_unix, ...rest }) => ({
        ...rest,
      })),
    };
    const invalidTestData = {
      ...filler,
      dateSeries: { ...dateSeriesRest, values: [...dateSeriesValues] },
      dateSpanSeries: invalidDateSpanSeries,
    };

    // Date span series values should be different
    expect(dateSpanSeriesValues).not.toStrictEqual(
      invalidTestData.dateSpanSeries.values
    );

    // Sorting in place
    expect(() => sortTimeSeriesInDataInPlace(invalidTestData)).toThrow(Error);
  });

  it('Should throw an error when there are no date_start_unix in a date span series', () => {
    const invalidDateSpanSeries = {
      ...dateSpanSeriesRest,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      values: [...dateSpanSeriesValues].map(({ date_start_unix, ...rest }) => ({
        ...rest,
      })),
    };
    const invalidTestData = {
      ...filler,
      dateSeries: { ...dateSeriesRest, values: [...dateSeriesValues] },
      dateSpanSeries: invalidDateSpanSeries,
    };

    // Date span series values should be different
    expect(dateSpanSeriesValues).not.toStrictEqual(
      invalidTestData.dateSpanSeries.values
    );

    // Sorting in place
    expect(() => sortTimeSeriesInDataInPlace(invalidTestData)).toThrow(Error);
  });
});
