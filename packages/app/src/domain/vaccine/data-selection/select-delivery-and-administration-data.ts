import {
  Nl,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';

export type VaccineDeliveryAndAdministrationsValue = Optional<
  Omit<NlVaccineDeliveryValue, 'total' | 'date_start_unix' | 'date_end_unix'>,
  'date_of_report_unix'
> & { total_delivered: number; date_unix: number } & Omit<
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
      total_delivered: vaccine_delivery.values[index].total,
      date_unix: vaccine_delivery.values[index].date_end_unix,
      ...vaccine_delivery.values[index],
      ...vaccine_administered.values[index],
    };
    delete (value as Record<string, number>).date_start_unix;
    delete (value as Record<string, number>).date_end_unix;
    values.push(value);
  }

  /*for (const [index] of vaccine_administered_estimate.values.entries()) {
    const value = {
      total_delivered: vaccine_delivery_estimate.values[index].total,
      date_unix: vaccine_delivery_estimate.values[index].date_end_unix,
      ...vaccine_delivery_estimate.values[index],
      ...vaccine_administered_estimate.values[index],
    };
    delete (value as Record<string, number>).date_start_unix;
    delete (value as Record<string, number>).date_end_unix;
    values.push(value);
  }*/

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [0, 0],
  };

  return { deliveryAndAdministration };
}
