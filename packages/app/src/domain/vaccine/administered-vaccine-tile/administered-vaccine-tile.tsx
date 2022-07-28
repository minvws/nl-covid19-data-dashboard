import { assert, colors } from '@corona-dashboard/common';
import { NlVaccineType } from '@corona-dashboard/common/src/types';
import { Vaccinaties as VaccinationIcon } from '@corona-dashboard/icons';
import { ChartTile } from '~/components';
import { PieChart, PiePartConfig } from '~/components/pie-chart';
import { MetadataProps } from '~/components/metadata';

interface AdministeredVaccinationProps {
  title: string;
  description: string;
  data: NlVaccineType[];
  metadata: MetadataProps;
}

const vaccines = [
  'bio_n_tech_pfizer',
  'pfizer',
  'moderna',
  'astra_zeneca',
  'janssen',
  'novavax',
  'cure_vac',
  'sanofi',
] as const;
vaccines.forEach((x) =>
  assert(
    colors.data.vaccines[x],
    `[${AdministeredVaccinationTile.name}] missing vaccine color for vaccine ${x}`
  )
);

export function AdministeredVaccinationTile({
  title,
  description,
  data,
  metadata,
}: AdministeredVaccinationProps) {
  const formatLabel = (label: string, value: number) =>
    `${label}: **${value}**`;

  const mappedData: Record<string, number> = {};
  data.forEach(
    (vaccineType) =>
      (mappedData[vaccineType.vaccine_type_name] =
        vaccineType.vaccine_type_value)
  );
  const dataConfig = data
    .filter((vaccineType) => !!vaccineType.vaccine_type_value)
    .sort(
      (vaccineTypeA, vaccineTypeB) =>
        vaccineTypeB.vaccine_type_value - vaccineTypeA.vaccine_type_value
    )
    .map<PiePartConfig<typeof mappedData>>((vaccineType) => {
      return {
        metricProperty: vaccineType.vaccine_type_name,
        color: '#f3f', // TODO: change this
        label: formatLabel(
          vaccineType.vaccine_type_name,
          vaccineType.vaccine_type_value
        ),
        tooltipLabel: formatLabel(
          vaccineType.vaccine_type_name,
          vaccineType.vaccine_type_value
        ),
      };
    });

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      hasSplitLayout
    >
      <PieChart
        data={mappedData}
        dataConfig={dataConfig}
        icon={<VaccinationIcon />}
        iconFill={colors.body}
      />
    </ChartTile>
  );
}
