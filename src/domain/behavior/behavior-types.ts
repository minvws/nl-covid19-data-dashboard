import siteText from '~/locale/index';

export type BehaviorIdentifier =
  | 'wash_hands'
  | 'keep_distance'
  | 'work_from_home'
  | 'avoid_crowds'
  | 'symptoms_stay_home'
  | 'symptoms_get_tested'
  | 'wear_mask_public_indoors'
  | 'wear_mask_public_transport'
  | 'sneeze_cough_elbow'
  | 'max_visitors_home';

export type BehaviorTrendType = 'up' | 'down' | 'equal' | null;

export type GedragText = typeof siteText.regionaal_gedrag &
  typeof siteText.nl_gedrag;
