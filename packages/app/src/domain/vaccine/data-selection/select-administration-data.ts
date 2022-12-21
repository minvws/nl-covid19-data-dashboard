import { NlVaccineAdministeredArchived_20220518, NlVaccineAdministeredArchived_20220518Value } from '@corona-dashboard/common';
import { omit } from 'lodash';

export type VaccineAdministrationsValue = Omit<NlVaccineAdministeredArchived_20220518Value, 'date_start_unix' | 'date_end_unix'> & {
  date_unix: number;
};

export type AdministrationData = {
  values: VaccineAdministrationsValue[];
  estimatedRange: [number, number];
  last_value: NlVaccineAdministeredArchived_20220518Value;
};

export function selectAdministrationData(vaccineAdministered: NlVaccineAdministeredArchived_20220518) {
  const values: VaccineAdministrationsValue[] = vaccineAdministered.values.map((value, index) => ({
    ...omit(value, ['date_start_unix', 'date_end_unix']),
    date_unix: vaccineAdministered.values[index].date_end_unix,
  }));

  const administrationData: AdministrationData = {
    values,
    estimatedRange: [0, 0],
    last_value: vaccineAdministered.last_value,
  };

  return { administrationData };
}
