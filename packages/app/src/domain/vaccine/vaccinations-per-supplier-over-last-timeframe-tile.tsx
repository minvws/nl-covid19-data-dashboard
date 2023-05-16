import { assert, colors } from '@corona-dashboard/common';
import { NlVaccineType } from '@corona-dashboard/common/src/types';
import { Vaccinaties as VaccinationIcon } from '@corona-dashboard/icons';
import { useIntl } from '~/intl';
import { ChartTileDoubleColumn } from '~/components/chart-tile-double-column';
import { MetadataProps } from '~/components/metadata';
import { PieChart, PiePartConfig } from '~/components/pie-chart';

interface VaccinationsPerSupplierOverLastTimeframeTileProps {
  title: string;
  description: string;
  data: NlVaccineType[];
  metadata: MetadataProps;
}

/**
 * This list contains duplicate entries, because BE is unable to deliver
 * specific IDs that match with previously delivered data entry IDs.
 * As per example: 'bio_n_tech_pfizer' vs 'BioNTech/Pfizer'.
 * This has been introduced as part of COR-938.
 * @TODO - remove duplicates when/if BE is able to provide IDs.
 */
const vaccines = [
  'bio_n_tech_pfizer',
  'pfizer',
  'BioNTech/Pfizer',
  'moderna',
  'Moderna',
  'astra_zeneca',
  'AstraZeneca',
  'janssen',
  'Janssen',
  'novavax',
  'Novavax',
  'cure_vac',
  'sanofi',
] as const;
vaccines.forEach((vaccine) => assert(colors.vaccines[vaccine], `[${VaccinationsPerSupplierOverLastTimeframeTile.name}] missing vaccine color for vaccine ${vaccine}`));

export function VaccinationsPerSupplierOverLastTimeframeTile({ title, description, data, metadata }: VaccinationsPerSupplierOverLastTimeframeTileProps) {
  const { formatNumber } = useIntl();

  const formatLabel = (label: string, value: number) => `${label}: **${formatNumber(value)}**`;

  const mappedData: Record<string, number> = {};
  data.forEach((vaccineType) => (mappedData[vaccineType.vaccine_type_name] = vaccineType.vaccine_type_value));
  const dataConfig = data
    .filter((vaccineType) => !!vaccineType.vaccine_type_value)
    .sort((vaccineTypeA, vaccineTypeB) => vaccineTypeB.vaccine_type_value - vaccineTypeA.vaccine_type_value)
    .map<PiePartConfig<typeof mappedData>>((vaccineType) => {
      return {
        metricProperty: vaccineType.vaccine_type_name,
        color: colors.vaccines[vaccineType.vaccine_type_name as keyof typeof colors.vaccines],
        label: formatLabel(vaccineType.vaccine_type_name, vaccineType.vaccine_type_value),
        tooltipLabel: formatLabel(vaccineType.vaccine_type_name, vaccineType.vaccine_type_value),
      };
    });

  return (
    <ChartTileDoubleColumn title={title} description={description} metadata={metadata} disableFullscreen>
      <PieChart data={mappedData} dataConfig={dataConfig} donutWidth={25} icon={<VaccinationIcon />} iconFill={colors.black} innerSize={180} marginLeft={32} marginRight={32} />
    </ChartTileDoubleColumn>
  );
}
