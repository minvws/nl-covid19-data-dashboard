import { Nl, NlVaccineAdministeredValue } from '@corona-dashboard/common';

export type VaccineDeliveryAndAdministrationsValue = Partial<{
  date_unix: number;
  total: number;
  date_of_report_unix: number;
  date_of_insertion_unix: number;
  astra_zeneca: number;
  pfizer: number;
  janssen: number;
  moderna: number;
  novavax: number;
}>;

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
