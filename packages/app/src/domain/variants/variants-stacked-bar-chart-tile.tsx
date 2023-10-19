import { ChartTile, Markdown, MetadataProps } from '~/components';
import { Box } from '~/components/base';
import { colors, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { ColorMatch, VariantChartValue, VariantsStackedAreaTileText } from '~/domain/variants/data-selection/types';
import { StackedChart } from '~/components/stacked-chart';

//const alwaysEnabled: (keyof VariantChartValue)[] = [];

interface VariantsStackedBarChartTileProps {
  title: string;
  description: string;
  _helpText: string;
  values: VariantChartValue[];
  _variantLabels: VariantsStackedAreaTileText;
  _variantColors: ColorMatch[];
  metadata: MetadataProps;
}

export const VariantsStackedBarChartTile = ({ title, description, _helpText, values, _variantLabels, _variantColors, metadata }: VariantsStackedBarChartTileProps) => {
  //const {list, toggle, clear} = useList<keyof VariantChartValue>(alwaysEnabled);

  const [variantTimeFrame, setVariantTimeFrame] = useState<TimeframeOption>(TimeframeOption.THREE_MONTHS);

  //const [seriesConfig, selectionOptions] = useSeriesConfig(variantLabels, values, variantColors);

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={TimeframeOptionsList}
      timeframeInitialValue={TimeframeOption.THREE_MONTHS}
      onSelectTimeframe={setVariantTimeFrame}
    >
      <Box>
        <Box>
          <Markdown content="placeholder"></Markdown>
        </Box>
      </Box>
      {/*<InteractiveLegend helpText={helpText} selectOptions={selectionOptions} selection={list} onToggleItem={toggle} onReset={clear} />*/}
      <StackedChart
        accessibility={{
          key: 'variants_stacked_area_over_time_chart',
        }}
        values={values}
        config={[
          {
            metricProperty: 'other_variants_percentage' as const,
            color: colors.blue2,
            label: 'hello',
          },
          {
            metricProperty: 'eg5_percentage' as const,
            color: colors.green1,
            label: 'hi',
          },
        ]}
        timeframe={variantTimeFrame}
      />
    </ChartTile>
  );
};
