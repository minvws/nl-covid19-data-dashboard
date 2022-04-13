import {
  NlVaccineAdministered,
  NlVaccineAdministeredValue,
} from '@corona-dashboard/common';

export type VaccineDeliveryAndAdministrationsValue =
  NlVaccineAdministeredValue & {
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
      ...value,
      date_unix: vaccineAdministered.values[index].date_end_unix,
    }));

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [0, 0],
    last_value: vaccineAdministered.last_value,
  };

  return { deliveryAndAdministration };
}
