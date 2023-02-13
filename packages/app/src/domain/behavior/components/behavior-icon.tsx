import {
  Avondklok,
  BasisregelsAfstand,
  BasisregelsDrukte,
  BasisregelsElleboog,
  BasisregelsHandenwassen,
  BasisregelsMondkapje,
  BasisregelsTesten,
  FrisseLucht,
  Klachten,
  MaxVisitors,
  OnderwijsEnKinderopvangOpAfstand,
} from '@corona-dashboard/icons';
import { space } from '~/style/theme';
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
  posttest_isolation: Klachten,
};

interface BehaviorIconProps {
  name: BehaviorIdentifier;
  size?: string;
}

export function BehaviorIcon({ name, size = space[4] }: BehaviorIconProps) {
  const Icon = icons[name];
  return <Icon width={size} height={size} aria-hidden="true" />;
}
