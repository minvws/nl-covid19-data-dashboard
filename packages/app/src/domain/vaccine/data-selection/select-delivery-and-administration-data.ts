import {
  National,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import first from 'lodash/first';
import last from 'lodash/last';

export type VaccineDeliveryAndAdministrationsValue = Optional<
  Omit<NlVaccineDeliveryValue, 'total'>,
  'date_of_report_unix'
> & { total_delivered: number } & NlVaccineAdministeredValue;

export type DeliveryAndAdministrationData = {
  values: VaccineDeliveryAndAdministrationsValue[];
  estimatedRange: [number, number];
};

export function selectDeliveryAndAdministrationData(nlData: National) {
  const {
    vaccine_administered,
    vaccine_administered_estimate,
    vaccine_delivery,
    vaccine_delivery_estimate,
  } = nlData;

  const values: VaccineDeliveryAndAdministrationsValue[] = [];

  for (const [index] of vaccine_administered.values.entries()) {
    values.push({
      total_delivered: vaccine_delivery.values[index].total,
      ...vaccine_delivery.values[index],
      ...vaccine_administered.values[index],
    });
  }

  for (const [index] of vaccine_administered_estimate.values.entries()) {
    values.push({
      total_delivered: vaccine_delivery_estimate.values[index].total,
      ...vaccine_delivery_estimate.values[index],
      ...vaccine_administered_estimate.values[index],
    });
  }

  const deliveryAndAdministration: DeliveryAndAdministrationData = {
    values,
    estimatedRange: [
      first(vaccine_delivery_estimate.values)?.date_start_unix || 0,
      last(vaccine_delivery_estimate.values)?.date_end_unix || 0,
    ],
  };

  return { deliveryAndAdministration };
}
