import { ChartTile, Markdown, MetadataProps } from '~/components';
import { Box } from '~/components/base';

interface VariantsStackedBarChartTileProps {
  title: string;
  description: string;
  _helpText: string;
  metadata: MetadataProps;
}

export const VariantsStackedBarChartTile = ({ title, description, _helpText, metadata }: VariantsStackedBarChartTileProps) => {
  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      <Box>
        <Box>
          <Markdown content="placeholder"></Markdown>
        </Box>
      </Box>
      {/*<InteractiveLegend helpText={helpText} selectOptions={} selection={} onToggleItem={} />*/}
      {/*<StackedChart accessibility={{key: 'variants_stacked_area_over_time_chart'}} values={} config={} />*/}
    </ChartTile>
  );
};
