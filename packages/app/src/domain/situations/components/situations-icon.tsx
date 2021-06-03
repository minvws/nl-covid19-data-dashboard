import gatherings from '~/assets/svg/situations/gatherings.svg';
import healthcare from '~/assets/svg/situations/healthcare.svg';
import homevisit from '~/assets/svg/situations/homevisit.svg';
import horeca from '~/assets/svg/situations/horeca.svg';
import school from '~/assets/svg/situations/school.svg';
import travelling from '~/assets/svg/situations/travelling.svg';
import work from '~/assets/svg/situations/work.svg';
import other from '~/assets/svg/situations/other.svg';

import { SituationIdentifier } from '../situation-types';

const icons: Record<SituationIdentifier, typeof gatherings> = {
  gatherings,
  healthcare,
  homevisit,
  horeca,
  school,
  travelling,
  work,
  other,
};

interface SituationIconProps {
  name: SituationIdentifier;
  size?: number;
}

export function SituationIcon({ name, size = 36 }: SituationIconProps) {
  const Icon = icons[name];
  return <Icon width={size} height={size} />;
}
