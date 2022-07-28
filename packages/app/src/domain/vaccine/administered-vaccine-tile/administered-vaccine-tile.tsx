import { assert, colors } from '@corona-dashboard/common';
import { Vaccinaties as VaccinationIcon } from '@corona-dashboard/icons';
import { ChartTile } from '~/components';
import { PieChart } from '~/components/pie-chart';
import { SiteText } from '~/locale';
import { MetadataProps } from '~/components/metadata';

interface AdministeredVaccinationProps {
  title: string;
  description: string;
  data: any;
  text: SiteText['pages']['vaccinationsPage']['nl'];
  metadata: MetadataProps;
}

const vaccines = [
  'pfizer',
  'moderna',
  'astra_zeneca',
  'janssen',
  'novavax',
] as const;
vaccines.forEach((x) =>
  assert(
    colors.data.vaccines[x],
    ''
    // TODO: fix this
    // `[${AdministeredVaccinationTile.name}] missing vaccine color for vaccine ${x}`
  )
);

export function AdministeredVaccinationTile({
  title,
  description,
  data,
  text,
  metadata,
}: AdministeredVaccinationProps) {
  const dataConfig = vaccines
    .map((vaccine) => {
      return {
        metricProperty: vaccine,
        color: colors.data.vaccines[vaccine],
        label: text.data.vaccination_chart.product_names[vaccine],
        tooltipLabel: text.data.vaccination_chart.product_names[vaccine],
        value: data[vaccine],
      };
    })
    .sort((entryA, entryB) => entryB.value - entryA.value);

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      hasSplitLayout
    >
      <PieChart
        data={data}
        dataConfig={dataConfig}
        icon={<VaccinationIcon />}
        iconFill={colors.body}
      />
    </ChartTile>
  );
}
