import { National, NlVaccineStockValue } from '@corona-dashboard/common';
import { colors } from '~/style/theme';

interface VaccineStock {
  metricProperty: keyof NlVaccineStockValue;
  color: string;
  label: string;
  amount: number;
}

export function useVaccineStockData(data: National): VaccineStock[] {
  const config: Omit<VaccineStock, 'amount'>[] = [
    {
      metricProperty: 'bio_n_tech_pfizer',
      color: colors.data.vaccines.bio_n_tech_pfizer,
      label: 'BioNTech/Pfizer',
    },
    {
      metricProperty: 'moderna',
      color: colors.data.vaccines.moderna,
      label: 'Moderna',
    },
    {
      metricProperty: 'astra_zeneca',
      color: colors.data.vaccines.astra_zeneca,
      label: 'AstraZeneca',
    },
  ];

  return config.map(
    (vaccine: Omit<VaccineStock, 'amount'>): VaccineStock => {
      return {
        ...vaccine,
        amount: data.vaccine_stock.last_value[vaccine.metricProperty],
      };
    }
  );
}
