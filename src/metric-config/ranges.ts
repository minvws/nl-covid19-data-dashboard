/**
 * This is a (temporary) replacement of the RANGES.json file with manual
 * configuration to help the cleanup migration and move towards a different
 * approach for defining or using data ranges.
 *
 * Note that these properties are not scoped to NL/VR/GM just like the original
 * ranges file was not scoped, meaning you would have the set the min/max
 * globally for each property.
 */

export const ranges = {
  intake_hospital_ma__moving_average_hospital: {
    min: 0,
    max: 0,
  },

  intake_intensivecare_ma__moving_average_ic: {
    min: 0,
    max: 0,
  },

  infected_people_delta_normalized__infected_daily_increase: {
    min: 0,
    max: 0,
  },
};
