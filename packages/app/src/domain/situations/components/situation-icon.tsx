import { Gathering } from '@corona-dashboard/icons';
import { HealthCare } from '@corona-dashboard/icons';
import { HomeAndVisits } from '@corona-dashboard/icons';
import { Hospitality } from '@corona-dashboard/icons';
import { Other } from '@corona-dashboard/icons';
import { SchoolAndDayCare } from '@corona-dashboard/icons';
import { Travel } from '@corona-dashboard/icons';
import { Work } from '@corona-dashboard/icons';
import { SituationKey } from '../logic/situations';

const icons = {
  home_and_visits: HomeAndVisits,
  work: Work,
  school_and_day_care: SchoolAndDayCare,
  health_care: HealthCare,
  gathering: Gathering,
  travel: Travel,
  hospitality: Hospitality,
  other: Other,
};

export function SituationIcon({ id }: { id: SituationKey }) {
  const IconFromMap = icons[id];
  return <IconFromMap heigth="36px" width="36px"/>;
}
