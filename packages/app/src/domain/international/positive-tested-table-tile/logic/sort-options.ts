export const positiveTestedSortOptions = {
  infected_per_100k_low_to_high: (a, b) => {
    if (
      (a.data.infected_per_100k ?? -Infinity) <
      (b.data.infected_per_100k ?? -Infinity)
    )
      return -1;
    if (
      (b.data.infected_per_100k ?? -Infinity) <
      (a.data.infected_per_100k ?? -Infinity)
    )
      return 1;
    return 0;
  },

  infected_per_100k_high_to_low: (a, b) => {
    if (
      (a.data.infected_per_100k ?? -Infinity) >
      (b.data.infected_per_100k ?? -Infinity)
    )
      return -1;
    if (
      (b.data.infected_per_100k ?? -Infinity) >
      (a.data.infected_per_100k ?? -Infinity)
    )
      return 1;
    return 0;
  },

  infected_low_to_high: (a, b) => {
    if ((a.data.infected ?? -Infinity) < (b.data.infected ?? -Infinity))
      return -1;
    if ((b.data.infected ?? -Infinity) < (a.data.infected ?? -Infinity))
      return 1;
    return 0;
  },

  infected_high_to_low: (a, b) => {
    if ((a.data.infected ?? -Infinity) > (b.data.infected ?? -Infinity))
      return -1;
    if ((b.data.infected ?? -Infinity) > (a.data.infected ?? -Infinity))
      return 1;
    return 0;
  },
};

export type SortIdentifier = keyof typeof positiveTestedSortOptions;
