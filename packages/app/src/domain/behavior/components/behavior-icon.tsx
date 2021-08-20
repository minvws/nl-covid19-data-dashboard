import { curfew } from '@corona-dashboard/icons';
import { wash_hands } from '@corona-dashboard/icons';
import { keep_distance } from '@corona-dashboard/icons';
import { work_from_home } from '@corona-dashboard/icons';
import { avoid_crowds } from '@corona-dashboard/icons';
import { symptoms_stay_home_if_mandatory } from '@corona-dashboard/icons';
import { symptoms_get_tested } from '@corona-dashboard/icons';
import { wear_mask_public_indoors } from '@corona-dashboard/icons';
import { wear_mask_public_transport } from '@corona-dashboard/icons';
import { sneeze_cough_elbow } from '@corona-dashboard/icons';
import { max_visitors } from '@corona-dashboard/icons';
import { BehaviorIdentifier } from '../logic/behavior-types';

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
