// import { NlVariantsValue } from '@corona-dashboard/common';

const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

function getVariantsDataValue(date_end_unix: number) {
  const parts = [...splitNParts(100, 5)];

  const value = {
    alpha_percentage: parts[0],
    beta_percentage: parts[1],
    delta_percentage: parts[2],
    theta_percentage: parts[3],
    other_percentage: parts[4],
    date_start_unix: date_end_unix - ONE_WEEK_IN_SECONDS,
    date_end_unix,
    date_of_insertion_unix: date_end_unix,
  };

  return value;
}

export function mockVariantsData() {
  // console.log(fillWithRandom(4, 100));

  const values = Array(20)
    .fill(null)
    .map((_, i) =>
      getVariantsDataValue(NOW_IN_SECONDS - ONE_WEEK_IN_SECONDS * i)
    )
    .sort((a, b) => a.date_end_unix - b.date_end_unix);

  const value = {
    values,
    last_value: values[values.length - 1],
  };

  return value;
}

function* splitNParts(num: number, parts: number) {
  let sumParts = 0;
  for (let i = 0; i < parts - 1; i++) {
    const pn = Math.ceil(Math.random() * (num - sumParts));
    yield pn;
    sumParts += pn;
  }
  yield num - sumParts;
}
