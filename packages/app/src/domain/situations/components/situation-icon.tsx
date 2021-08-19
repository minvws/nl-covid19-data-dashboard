import { ReactComponent as gathering } from '~/assets/situations/gathering.svg';
import { ReactComponent as health_care } from '~/assets/situations/health_care.svg';
import { ReactComponent as home_and_visits } from '~/assets/situations/home_and_visits.svg';
import { ReactComponent as hospitality } from '~/assets/situations/hospitality.svg';
import { ReactComponent as other } from '~/assets/situations/other.svg';
import { ReactComponent as school_and_day_care } from '~/assets/situations/school_and_day_care.svg';
import { ReactComponent as travel } from '~/assets/situations/travel.svg';
import { ReactComponent as work } from '~/assets/situations/work.svg';
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
