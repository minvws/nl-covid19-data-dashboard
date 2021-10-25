import {
  assert,
  colors,
  Nl,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';

export const vaccines = [
  'pfizer',
  'moderna',
  'astra_zeneca',
  'janssen',
] as const;
vaccines.forEach((x) =>
  assert(colors.data.vaccines[x], `missing vaccine color for vaccine ${x}`)
);

export type VaccineDeliveryAndAdministrationsValue = Optional<
  Omit<NlVaccineDeliveryValue, 'total' | 'date_start_unix' | 'date_end_unix'>,
  'date_of_report_unix'
> & { date_unix: number } & Omit<
    NlVaccineAdministeredValue,
    'date_start_unix' | 'date_end_unix'
  >;

export type DeliveryAndAdministrationData = {
  values: VaccineDeliveryAndAdministrationsValue[];
  estimatedRange: [number, number];
};

export function selectDeliveryAndAdministrationData(nlData: Nl) {
  const { vaccine_administered, vaccine_delivery } = nlData;

  const values: VaccineDeliveryAndAdministrationsValue[] = [];

  for (const [index] of vaccine_administered.values.entries()) {
    const value = {
      date_unix: vaccine_delivery.values[index].date_end_unix,
      ...vaccine_delivery.values[index],
      ...vaccine_administered.values[index],
    };
    delete (value as Record<string, number>).date_start_unix;
    delete (value as Record<string, number>).date_end_unix;
    values.push(value);
  }

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [0, 0],
  };

  return { deliveryAndAdministration };
}
