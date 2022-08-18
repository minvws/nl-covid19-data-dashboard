import {
  BasisregelsDrukte,
  Avondklok,
  FrisseLucht,
  BasisregelsAfstand,
  MaxVisitors,
  BasisregelsElleboog,
  BasisregelsTesten,
  Klachten,
  BasisregelsHandenwassen,
  BasisregelsMondkapje,
  OnderwijsEnKinderopvangOpAfstand,
} from '@corona-dashboard/icons';
import { BehaviorIdentifier } from '../logic/behavior-types';

const icons: Record<BehaviorIdentifier, typeof Avondklok> = {
  curfew: Avondklok,
  wash_hands: BasisregelsHandenwassen,
  keep_distance: BasisregelsAfstand,
  work_from_home: OnderwijsEnKinderopvangOpAfstand,
  avoid_crowds: BasisregelsDrukte,
  symptoms_stay_home_if_mandatory: Klachten,
  symptoms_get_tested: BasisregelsTesten,
  wear_mask_public_indoors: BasisregelsMondkapje,
  wear_mask_public_transport: BasisregelsMondkapje,
  sneeze_cough_elbow: BasisregelsElleboog,
  max_visitors: MaxVisitors,
  ventilate_home: FrisseLucht,
  selftest_visit: BasisregelsTesten,
};

interface BehaviorIconProps {
  name: BehaviorIdentifier;
  size?: number;
}

export function BehaviorIcon({ name, size = 32 }: BehaviorIconProps) {
  const Icon = icons[name];
  return <Icon width={size} height={size} />;
}
