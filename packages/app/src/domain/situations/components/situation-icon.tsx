import gathering from '~/assets/situations/gathering.svg';
import health_care from '~/assets/situations/health_care.svg';
import home_and_visits from '~/assets/situations/home_and_visits.svg';
import hospitality from '~/assets/situations/hospitality.svg';
import other from '~/assets/situations/other.svg';
import school_and_day_care from '~/assets/situations/school_and_day_care.svg';
import travel from '~/assets/situations/travel.svg';
import work from '~/assets/situations/work.svg';
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
