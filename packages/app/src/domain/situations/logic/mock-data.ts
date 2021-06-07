import {
  VrCollectionSituations,
  VrSituationsValue,
} from '@corona-dashboard/common';
import { vrData } from '~/data/vr';
import { SituationKey, situations } from './situations';

const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export function mockVrCollectionSituations() {
  return vrData.map((x) => getVrCollectionSituationsValue(x.code));
}

export function mockVrSituations(vrcode: string) {
  const values = Array(20)
    .fill(null)
    .map((_, i) =>
      getVrSituationsValue(vrcode, NOW_IN_SECONDS - ONE_WEEK_IN_SECONDS * i)
    )
    .sort((a, b) => a.date_end_unix - b.date_end_unix);

  const value = {
    values,
    last_value: values[values.length - 1],
  };

  return value;
}

function getVrSituationsValue(vrcode: string, date_end_unix: number) {
  const investigations_total = Math.round(Math.random() * 2000);
  const situations_known_total = Math.round(
    Math.random() * investigations_total
  );
  const situations_known_percentage =
    situations_known_total / investigations_total;

  const value: VrSituationsValue = {
    date_start_unix: date_end_unix - 60 * 60 * 24 * 7,
    date_end_unix,
    date_of_insertion_unix: date_end_unix,
    vrcode,
    has_sufficient_data: investigations_total > 1000,
    investigations_total,
    situations_known_percentage,
    situations_known_total,
    ...getSituationsValues(),
  };

  return value;
}

function getVrCollectionSituationsValue(vrcode: string) {
  const value: VrCollectionSituations = {
    date_start_unix: NOW_IN_SECONDS - ONE_WEEK_IN_SECONDS,
    date_end_unix: NOW_IN_SECONDS,
    date_of_insertion_unix: NOW_IN_SECONDS,
    vrcode,
    has_sufficient_data: Math.random() < 0.5,
    ...getSituationsValues(),
  };

  return value;
}

function getSituationsValues() {
  const getPercentage = splitNParts(100, 8);
  return Object.fromEntries(
    situations.map((x) => [x, getPercentage.next().value || null])
  ) as Pick<VrSituationsValue, SituationKey>;
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
