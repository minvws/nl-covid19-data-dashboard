import { Nl, NlVaccineAdministeredValue } from '@corona-dashboard/common';

export type VaccineDeliveryAndAdministrationsValue =
  NlVaccineAdministeredValue & {
    date_unix: number;
  };

export type DeliveryAndAdministrationData = {
  values: VaccineDeliveryAndAdministrationsValue[];
  estimatedRange: [number, number];
  last_value: NlVaccineAdministeredValue;
};

export function selectDeliveryAndAdministrationData(nlData: Nl) {
  const { vaccine_administered } = nlData;

  const values: VaccineDeliveryAndAdministrationsValue[] =
    vaccine_administered.values.map((value, index) => ({
      ...value,
      date_unix: vaccine_administered.values[index].date_end_unix,
    }));

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [0, 0],
    last_value: vaccine_administered.last_value,
  };

  return { deliveryAndAdministration };
}
