import {
  Nl,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';

export function useVaccineDeliveryData(
  data: Pick<
    Nl,
    | 'vaccine_delivery'
    | 'vaccine_administered'
    | 'vaccine_delivery_estimate'
    | 'vaccine_administered_estimate'
  >
): [
  NlVaccineDeliveryValue[],
  NlVaccineDeliveryEstimateValue[],
  NlVaccineAdministeredValue[],
  NlVaccineAdministeredEstimateValue[]
] {
  return useMemo(() => {
    const vaccineDeliveryValues = [...data.vaccine_delivery.values];
    const vaccineDeliveryEstimateValues = [
      ...data.vaccine_delivery_estimate.values,
    ];
    const vaccineAdministeredValues = [...data.vaccine_administered.values];
    const vaccineAdministeredEstimateValues = [
      ...data.vaccine_administered_estimate.values,
    ];

    // add the first estimate to the delivered values, otherwise the lines and stacks
    // will have a gap rendered between them
    vaccineDeliveryEstimateValues.unshift({
      ...vaccineDeliveryValues[vaccineDeliveryValues.length - 1],
    } as NlVaccineDeliveryEstimateValue);
    vaccineAdministeredEstimateValues.unshift({
      ...vaccineAdministeredValues[vaccineAdministeredValues.length - 1],
    } as NlVaccineAdministeredEstimateValue);

    return [
      vaccineDeliveryValues,
      vaccineDeliveryEstimateValues,
      vaccineAdministeredValues,
      vaccineAdministeredEstimateValues,
    ];
  }, [data]);
}
