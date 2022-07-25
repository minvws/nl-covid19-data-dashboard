import { ChartTile, MetadataProps } from '~/components';
import { PieChart } from '~/components/pie-chart';

interface AdministeredVaccinationProps {
  title: string;
  description: string;
  metadata: MetadataProps;
  data: any;
}

export const AdministeredVaccinationTile = ({
  title,
  description,
  metadata,
  data,
}: AdministeredVaccinationProps) => {
  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      hasSplitLayout
    >
      <PieChart
        data={data}
        dataConfig={[
          {
            metricProperty: 'pfizer',
            color: 'hotpink',
            label: 'pfizer',
            tooltipLabel: 'tooltip pfizer',
          },
          {
            metricProperty: 'janssen',
            color: 'blue',
            label: 'janssen',
            tooltipLabel: 'tooltip janssen',
          },
        ]}
      />
    </ChartTile>
  );
};
