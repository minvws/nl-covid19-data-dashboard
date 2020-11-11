import siteText from '~/locale/index';

export const behaviorIdentifier = [
  'wash_hands',
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

export type BehaviorIdentifier = typeof behaviorIdentifier[number];

export type BehaviorTrendType = 'up' | 'down' | 'equal';

export type GedragText = typeof siteText.regionaal_gedrag &
  typeof siteText.nl_gedrag;
