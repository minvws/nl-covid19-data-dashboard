import { gathering } from '@corona-dashboard/icons';
import { health_care } from '@corona-dashboard/icons';
import { home_and_visits } from '@corona-dashboard/icons';
import { hospitality } from '@corona-dashboard/icons';
import { other } from '@corona-dashboard/icons';
import { school_and_day_care } from '@corona-dashboard/icons';
import { travel } from '@corona-dashboard/icons';
import { work } from '@corona-dashboard/icons';
import { SituationKey } from '../logic/situations';

const icons = {
  home_and_visits,
  work,
  school_and_day_care,
  health_care,
  gathering,
  travel,
  hospitality,
  other,
};

export function SituationIcon({ id }: { id: SituationKey }) {
  const IconFromMap = icons[id];
  return <IconFromMap />;
}
