import { National } from '@corona-dashboard/common';
import { useMemo } from 'react';

export function useVaccineDeliveryData(data: National) {
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
    });
    vaccineAdministeredEstimateValues.unshift({
      ...vaccineAdministeredValues[vaccineAdministeredValues.length - 1],
    });

    return [
      vaccineDeliveryValues,
      vaccineDeliveryEstimateValues,
      vaccineAdministeredValues,
      vaccineAdministeredEstimateValues,
    ];
  }, [data]);
}
