import {
  NlVaccineAdministered,
  NlVaccineAdministeredValue,
} from '@corona-dashboard/common';
import { omit } from 'lodash';

export type VaccineAdministrationsValue = Omit<
  NlVaccineAdministeredValue,
  'date_start_unix' | 'date_end_unix'
> & {
  date_unix: number;
};

export type AdministrationData = {
  values: VaccineAdministrationsValue[];
  estimatedRange: [number, number];
  last_value: NlVaccineAdministeredValue;
};

export function selectAdministrationData(
  vaccineAdministered: NlVaccineAdministered
) {
  const values: VaccineAdministrationsValue[] = vaccineAdministered.values.map(
    (value, index) => ({
      ...omit(value, ['date_start_unix', 'date_end_unix']),
      date_unix: vaccineAdministered.values[index].date_end_unix,
    })
  );

  const administrationData: AdministrationData = {
    values,
    estimatedRange: [0, 0],
    last_value: vaccineAdministered.last_value,
  };

  return { administrationData };
}
