import {
  DifferenceDecimal,
  NationalDifference,
} from '@corona-dashboard/common';

const variants = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'eta',
  'epsilon',
  'theta',
  'kappa',
  'other',
] as const;

export function mockVariantsDiffData(difference: NationalDifference) {
  variants.forEach((variant) => {
    const prop = `variants__${variant}_percentage` as const;
    difference[prop] = mockDifference(difference[prop]);
  });
  return difference;
}

const NOW_IN_SECONDS = Math.round(Date.now() / 1000);

function mockDifference(value?: DifferenceDecimal) {
  if (value) {
    return value;
  }

  return {
    old_value: 0,
    difference:
      Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1),
    new_date_unix: NOW_IN_SECONDS,
  };
}
