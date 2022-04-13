import {
  NlVaccineAdministered,
  NlVaccineAdministeredValue,
} from '@corona-dashboard/common';
import { omit } from 'lodash';

export type VaccineDeliveryAndAdministrationsValue = Omit<
  NlVaccineAdministeredValue,
  'date_start_unix' | 'date_end_unix'
> & {
  date_unix: number;
};

export type DeliveryAndAdministrationData = {
  values: VaccineDeliveryAndAdministrationsValue[];
  estimatedRange: [number, number];
  last_value: NlVaccineAdministeredValue;
};

export function selectDeliveryAndAdministrationData(
  vaccineAdministered: NlVaccineAdministered
) {
  const values: VaccineDeliveryAndAdministrationsValue[] =
    vaccineAdministered.values.map((value, index) => ({
      ...omit(value, ['date_start_unix', 'date_end_unix']),
      date_unix: vaccineAdministered.values[index].date_end_unix,
    }));

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [0, 0],
    last_value: vaccineAdministered.last_value,
  };

  return { deliveryAndAdministration };
}
