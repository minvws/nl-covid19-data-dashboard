import {
  NlBoosterShotPerAgeGroupValue,
  WEEK_IN_SECONDS,
} from '@corona-dashboard/common';

/**
 * @TODO: Please remove once data becomes avaliable
 */
export const DUMMY_DATA_BOOSTER_PER_AGE_GROUP = [
  {
    age_group_range: '81+',
    received_booster_total: 480,
    received_booster_percentage: 60,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '-1940',
  },
  {
    age_group_range: '71-80',
    received_booster_total: 356,
    received_booster_percentage: 50,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1941-1950',
  },
  {
    age_group_range: '61-70',
    received_booster_total: 121,
    received_booster_percentage: 40,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1951-1960',
  },
  {
    age_group_range: '51-60',
    received_booster_total: 96,
    received_booster_percentage: 30,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1961-1970',
  },
  {
    age_group_range: '41-50',
    received_booster_total: 54,
    received_booster_percentage: 20,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1971-1980',
  },
  {
    age_group_range: '31-40',
    received_booster_total: 12,
    received_booster_percentage: 10,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1981-1990',
  },
  {
    age_group_range: '18-30',
    received_booster_total: 0,
    received_booster_percentage: 0,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '1991-2003',
  },
  {
    age_group_range: '12-17',
    received_booster_total: 0,
    received_booster_percentage: 0,
    date_of_insertion_unix: 1637058313,
    date_start_unix: 1637058313 - WEEK_IN_SECONDS,
    date_end_unix: 1637058313,
    birthyear_range: '2004-2009',
  },
] as NlBoosterShotPerAgeGroupValue[];
