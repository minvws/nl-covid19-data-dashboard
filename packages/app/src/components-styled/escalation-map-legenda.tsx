import { Regions, RegionsMetricName } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import {
  useChoroplethColorScale,
  useSafetyRegionData,
} from '~/components/choropleth/hooks';
import { getDataThresholds } from '~/components/choropleth/legenda/utils';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { regionGeo } from '~/components/choropleth/topology';
import { default as siteText, default as text } from '~/locale';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Heading, InlineText } from './typography';

const escalationThresholds = regionThresholds.escalation_levels.level;

interface EscalationMapLegendaProps<K extends RegionsMetricName> {
  metricName: K;
  metricProperty: string;
  data: Pick<Regions, K>;
}

export function EscalationMapLegenda<K extends RegionsMetricName>(
  props: EscalationMapLegendaProps<K>
) {
  const { metricName, metricProperty, data } = props;

  const { getChoroplethValue, hasData } = useSafetyRegionData(
    regionGeo,
    metricName,
    metricProperty,
    data
  );

  const selectedThreshold = getDataThresholds(
    regionThresholds,
    metricName,
    metricProperty
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    selectedThreshold
  );

  const totalItems = regionGeo.features.length;

  const sortedEscalationArray = useMemo(() => {
    if (!hasData) return [];

    // Add an amount key to the escalation object to count the amount of items
    const sortedEscalationArray = escalationThresholds.map((item) => ({
      ...item,
      amount: regionGeo.features.filter(
        (x) => item.color === getFillColor(x.properties.vrcode)
      ).length,
    }));

    return sortedEscalationArray;
  }, [getFillColor, hasData]);

  return (
    <Box spacing={3} aria-label="legend" width="100%">
      <Heading level={3} fontSize="1rem">
        {siteText.escalatie_niveau.legenda.titel}
      </Heading>
      {sortedEscalationArray.map((info) => (
        <Box key={info.threshold} display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            spacing={{ _: 2, sm: 3 }}
            spacingHorizontal
            width={{ _: '8rem', sm: '10rem' }}
          >
            <EscalationLevelIcon level={info.threshold} />
            <InlineText>
              {siteText.escalatie_niveau.types[info.threshold].titel}
            </InlineText>
          </Box>
          <EscalationBarLegenda
            info={info}
            totalItems={totalItems}
            label={text.escalatie_niveau.legenda}
          />
        </Box>
      ))}
    </Box>
  );
}

interface EscalationBarLegendaProps {
  info: {
    amount: number;
    color: string;
    threshold: number;
  };
  label: {
    titel: string;
    geen_regio: string;
    regios: string;
  };
  totalItems: number;
}

function EscalationBarLegenda(props: EscalationBarLegendaProps) {
  const { info, totalItems, label } = props;

  const barWidth = info.amount / totalItems;

  return (
    <Box flexGrow={1} paddingY={1} display="flex">
      <Box flexGrow={barWidth} backgroundColor={info.color} paddingRight={1} />
      <Box paddingLeft={2}>
        {info.amount
          ? replaceVariablesInText(label.regios, { amount: info.amount })
          : label.geen_regio}
      </Box>
    </Box>
  );
}
