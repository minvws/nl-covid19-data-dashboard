import { InTestedOverall } from '@corona-dashboard/common';

export const positiveTestedSortOptions = {
  infected_per_100k_average_high_to_low: (
    a: InTestedOverall,
    b: InTestedOverall
  ) => {
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

  infected_per_100k_average_low_to_high: (
    a: InTestedOverall,
    b: InTestedOverall
  ) => {
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

  infected_high_to_low: (a: InTestedOverall, b: InTestedOverall) => {
    if ((a.infected ?? -Infinity) > (b.infected ?? -Infinity)) return -1;
    if ((b.infected ?? -Infinity) > (a.infected ?? -Infinity)) return 1;
    return 0;
  },

  infected_low_to_high: (a: InTestedOverall, b: InTestedOverall) => {
    if ((a.infected ?? -Infinity) < (b.infected ?? -Infinity)) return -1;
    if ((b.infected ?? -Infinity) < (a.infected ?? -Infinity)) return 1;
    return 0;
  },
};

export type SortIdentifier = keyof typeof positiveTestedSortOptions;
