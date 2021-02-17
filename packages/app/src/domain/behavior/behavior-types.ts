export const behaviorIdentifiers = [
  'wash_hands',
  'curfew',
  'keep_distance',
  'work_from_home',
  'avoid_crowds',
  'symptoms_stay_home',
  'symptoms_get_tested',
  'wear_mask_public_indoors',
  'wear_mask_public_transport',
  'sneeze_cough_elbow',
  'max_visitors',
] as const;

export type BehaviorIdentifier = typeof behaviorIdentifiers[number];

export type BehaviorTrendType = 'up' | 'down' | 'equal';

export type BehaviorType = 'compliance' | 'support';

/**
 * @TODO
 * When TypeScript v4.1 is released we can implemenent the following magic:
 *
 *   export type BehaviorKey = `${BehaviorIdentifier}_${BehaviorType}`
 *
 * and transform lines like (coming from behavior-choropleth-tile.tsx):
 *
 *   const metricValueName = `${currentId}_${type}` as keyof RegionsBehavior;
 *
 * to:
 *
 *   const metricValueName: BehaviorKey = `${currentId}_${type}`;
 *
 * 🤯
 */
