const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export function mockVariantsData() {
  const value = {
    date_start_unix: NOW_IN_SECONDS - ONE_WEEK_IN_SECONDS,
    date_end_unix: NOW_IN_SECONDS,
    date_of_insertion_unix: NOW_IN_SECONDS,
  };

  return value;
}
