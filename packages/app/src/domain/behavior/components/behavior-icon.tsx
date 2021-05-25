import curfew from '~/assets/gedrag/curfew.svg';
import wash_hands from '~/assets/gedrag/wash_hands.svg';
import keep_distance from '~/assets/gedrag/keep_distance.svg';
import work_from_home from '~/assets/gedrag/work_from_home.svg';
import avoid_crowds from '~/assets/gedrag/avoid_crowds.svg';
import symptoms_stay_home_if_mandatory from '~/assets/gedrag/symptoms_stay_home.svg';
import symptoms_get_tested from '~/assets/gedrag/symptoms_get_tested.svg';
import wear_mask_public_indoors from '~/assets/gedrag/wear_mask_public_indoors.svg';
import wear_mask_public_transport from '~/assets/gedrag/wear_mask_public_transport.svg';
import sneeze_cough_elbow from '~/assets/gedrag/sneeze_cough_elbow.svg';
import max_visitors from '~/assets/gedrag/max_visitors.svg';
import { BehaviorIdentifier } from '../behavior-types';

const icons: Record<BehaviorIdentifier, typeof curfew> = {
  curfew,
  wash_hands,
  keep_distance,
  work_from_home,
  avoid_crowds,
  symptoms_stay_home_if_mandatory,
  symptoms_get_tested,
  wear_mask_public_indoors,
  wear_mask_public_transport,
  sneeze_cough_elbow,
  max_visitors,
};

interface BehaviorIconProps {
  name: BehaviorIdentifier;
  size?: number;
}

export function BehaviorIcon({ name, size = 32 }: BehaviorIconProps) {
  const Icon = icons[name];
  return <Icon width={size} height={size} />;
}
