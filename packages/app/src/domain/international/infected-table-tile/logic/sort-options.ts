type singleItem = {
  country_code: string;
  infected: number;
  infected_per_100k_average: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
};

export const positiveTestedSortOptions = {
  infected_per_100k_average_high_to_low: (a: singleItem, b: singleItem) => {
    if (
      (a.infected_per_100k_average ?? -Infinity) >
      (b.infected_per_100k_average ?? -Infinity)
    )
      return -1;
    if (
      (b.infected_per_100k_average ?? -Infinity) >
      (a.infected_per_100k_average ?? -Infinity)
    )
      return 1;
    return 0;
  },

  infected_per_100k_average_low_to_high: (a: singleItem, b: singleItem) => {
    if (
      (a.infected_per_100k_average ?? -Infinity) <
      (b.infected_per_100k_average ?? -Infinity)
    )
      return -1;
    if (
      (b.infected_per_100k_average ?? -Infinity) <
      (a.infected_per_100k_average ?? -Infinity)
    )
      return 1;
    return 0;
  },

  infected_high_to_low: (a: singleItem, b: singleItem) => {
    if ((a.infected ?? -Infinity) > (b.infected ?? -Infinity)) return -1;
    if ((b.infected ?? -Infinity) > (a.infected ?? -Infinity)) return 1;
    return 0;
  },

  infected_low_to_high: (a: singleItem, b: singleItem) => {
    if ((a.infected ?? -Infinity) < (b.infected ?? -Infinity)) return -1;
    if ((b.infected ?? -Infinity) < (a.infected ?? -Infinity)) return 1;
    return 0;
  },
};

export type SortIdentifier = keyof typeof positiveTestedSortOptions;
