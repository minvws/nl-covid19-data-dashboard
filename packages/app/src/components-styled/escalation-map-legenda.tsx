import { useMemo } from 'react';
import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import {
  useChoroplethColorScale,
  useSafetyRegionData,
} from '~/components/choropleth/hooks';
import { getDataThresholds } from '~/components/choropleth/legenda/utils';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { RegionsMetricName } from '~/components/choropleth/shared';
import styles from '~/components/choropleth/tooltips/tooltip.module.scss';
import { regionGeo } from '~/components/choropleth/topology';
import text from '~/locale';
import { Regions } from '~/types/data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;
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
        (i) => item.color === getFillColor(i.properties.vrcode)
      ).length,
    }));

    return sortedEscalationArray;
  }, [getFillColor, hasData]);

  return (
    <div className={styles.legenda} aria-label="legend">
      <h3>{text.escalatie_niveau.legenda.titel}</h3>
      {sortedEscalationArray.map((info) => (
        <div
          className={styles.escalationInfoLegenda}
          key={`legenda-item-${info?.threshold}`}
        >
          <Box display="flex" alignItems="center" width="10rem">
            <div className={styles.bubbleLegenda}>
              <EscalationLevelIcon level={info.threshold} />
            </div>
            <Box alignItems={'center'}>
              {text.escalatie_niveau.types[info.threshold].titel}
            </Box>
          </Box>
          <EscalationBarLegenda
            info={info}
            totalItems={totalItems}
            label={text.escalatie_niveau.legenda}
          />
        </div>
      ))}
    </div>
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
      <Box
        flexGrow={barWidth}
        backgroundColor={info.color}
        height={'100%'}
        paddingRight={1}
      />
      <Box paddingLeft={2}>
        {info.amount
          ? replaceVariablesInText(label.regios, { amount: info.amount })
          : label.geen_regio}
      </Box>
    </Box>
  );
}
