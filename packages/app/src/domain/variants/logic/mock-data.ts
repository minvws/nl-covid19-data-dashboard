import { NlVariantsValue } from '@corona-dashboard/common';

const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const randomNumberFrom = 1;
const randomNumberTo = 100;

function getVariantsDataValue(date_end_unix: number) {
  const value: NlVariantsValue = {
    alpha_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    alpha_occurrence: randomNumberFromTo(100, 1000),
    alpha_is_variant_of_concern: Math.random() > 0.5,
    beta_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    beta_occurrence: randomNumberFromTo(100, 1000),
    beta_is_variant_of_concern: Math.random() > 0.5,
    gamma_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    gamma_occurrence: randomNumberFromTo(100, 1000),
    gamma_is_variant_of_concern: Math.random() > 0.5,
    delta_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    delta_occurrence: randomNumberFromTo(100, 1000),
    delta_is_variant_of_concern: Math.random() > 0.5,
    eta_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    eta_occurrence: randomNumberFromTo(100, 1000),
    eta_is_variant_of_concern: Math.random() > 0.5,
    epsilon_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    epsilon_occurrence: randomNumberFromTo(100, 1000),
    epsilon_is_variant_of_concern: Math.random() > 0.5,
    theta_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    theta_occurrence: randomNumberFromTo(100, 1000),
    theta_is_variant_of_concern: Math.random() > 0.5,
    kappa_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    kappa_occurrence: randomNumberFromTo(100, 1000),
    kappa_is_variant_of_concern: Math.random() > 0.5,
    other_percentage: randomNumberFromTo(randomNumberFrom, randomNumberTo),
    other_occurrence: randomNumberFromTo(100, 1000),
    other_is_variant_of_concern: Math.random() > 0.5,
    sample_size: randomNumberFromTo(100, 1000),
    date_start_unix: date_end_unix - ONE_WEEK_IN_SECONDS,
    date_end_unix,
    date_of_insertion_unix: date_end_unix,
  };

  return value;
}

export function mockVariantsData() {
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

const randomNumberFromTo = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
