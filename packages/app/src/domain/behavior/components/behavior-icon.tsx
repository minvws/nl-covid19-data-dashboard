import { Curfew } from '@corona-dashboard/icons';
import { WashHands } from '@corona-dashboard/icons';
import { KeepDistance } from '@corona-dashboard/icons';
import { WorkFromHome } from '@corona-dashboard/icons';
import { AvoidCrowds } from '@corona-dashboard/icons';
import { SymptomsStayHome } from '@corona-dashboard/icons';
import { SymptomsGetTested } from '@corona-dashboard/icons';
import { WearMaskPublicIndoors } from '@corona-dashboard/icons';
import { WearMaskPublicTransport } from '@corona-dashboard/icons';
import { SneezeCoughElbow } from '@corona-dashboard/icons';
import { MaxVisitors } from '@corona-dashboard/icons';
import { BehaviorIdentifier } from '../logic/behavior-types';

const icons: Record<BehaviorIdentifier, typeof Curfew> = {
  curfew: Curfew,
  wash_hands: WashHands,
  keep_distance: KeepDistance,
  work_from_home: WorkFromHome,
  avoid_crowds: AvoidCrowds,
  symptoms_stay_home_if_mandatory: SymptomsStayHome,
  symptoms_get_tested: SymptomsGetTested,
  wear_mask_public_indoors: WearMaskPublicIndoors,
  wear_mask_public_transport: WearMaskPublicTransport,
  sneeze_cough_elbow: SneezeCoughElbow,
  max_visitors: MaxVisitors,
};

interface BehaviorIconProps {
  name: BehaviorIdentifier;
  size?: number;
}

export function BehaviorIcon({ name, size = 32 }: BehaviorIconProps) {
  const Icon = icons[name];
  return <Icon width={size} height={size} />;
}
