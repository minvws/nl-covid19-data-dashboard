import { VrCollection, VrCollectionMetricName } from '@corona-dashboard/common';
import { ReactNode, useMemo } from 'react';
import { Box } from '~/components/base';
import {
  getDataThresholds,
  useChoroplethColorScale,
  useVrData,
  vrGeo,
  vrThresholds,
} from '~/components/choropleth/logic';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { EscalationLevel } from '~/domain/restrictions/types';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { Heading, InlineText, Text } from './typography';

const escalationThresholds = vrThresholds.escalation_levels.level;

interface EscalationMapLegendaProps<K extends VrCollectionMetricName> {
  metricName: K;
  metricProperty: string;
  data: Pick<VrCollection, K>;
  lastDetermined: number;
}

export function EscalationMapLegenda<K extends VrCollectionMetricName>(
  props: EscalationMapLegendaProps<K>
) {
  const { metricName, metricProperty, data, lastDetermined } = props;
  const { siteText, formatDateFromSeconds } = useIntl();

  const { getChoroplethValue, hasData } = useVrData(
    vrGeo,
    metricName,
    metricProperty,
    data
  );

  const selectedThreshold = getDataThresholds(
    vrThresholds,
    metricName,
    metricProperty
  );

  const unknownLevelColor = useEscalationColor(null);

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    selectedThreshold
  );

  const totalItems = vrGeo.features.length;

  const sortedEscalationArray = useMemo(() => {
    if (!hasData) return [];

    const sortedEscalationArray = [] as {
      color: string;
      threshold: EscalationLevel;
      amount: number;
    }[];

    // Add an amount key to the escalation object to count the amount of items
    for (const item of escalationThresholds) {
      sortedEscalationArray.push({
        ...item,
        amount: vrGeo.features.filter(
          (x) => item.color === getFillColor(x.properties.vrcode)
        ).length,
      });
    }

    const unknownCount = vrGeo.features.filter(
      (x) => unknownLevelColor === getFillColor(x.properties.vrcode)
    ).length;

    if (unknownCount) {
      sortedEscalationArray.push({
        color: unknownLevelColor,
        threshold: null,
        amount: unknownCount,
      });
    }

    return sortedEscalationArray;
  }, [getFillColor, hasData, unknownLevelColor]);

  return (
    <Box width="100%" spacing={3}>
      <Box>
        <Heading level={3} variant="subtitle1">
          {siteText.escalatie_niveau.legenda.titel}
        </Heading>

        <Text>
          {replaceVariablesInText(
            siteText.escalatie_niveau.legenda.determined_on,
            { date: formatDateFromSeconds(lastDetermined, 'weekday-medium') }
          )}
        </Text>
      </Box>

      <Box spacing={1}>
        {sortedEscalationArray.map((info) => (
          <Box key={info.threshold} display="flex" alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              width={{ _: '8rem', sm: '10rem' }}
            >
              {info.threshold !== null && (
                <Box pr={2}>
                  <EscalationLevelIcon level={info.threshold} />
                </Box>
              )}
              <InlineText>
                {
                  siteText.escalatie_niveau.types[
                    getEscalationLevelIndexKey(info.threshold)
                  ].titel
                }
              </InlineText>
            </Box>
            <EscalationBarLegenda
              percentage={info.amount / totalItems}
              color={info.color}
            >
              {info.amount
                ? replaceVariablesInText(
                    info.amount === 1
                      ? siteText.escalatie_niveau.legenda.regio_singular
                      : siteText.escalatie_niveau.legenda.regio_plural,
                    { amount: info.amount }
                  )
                : siteText.escalatie_niveau.legenda.geen_regio}
            </EscalationBarLegenda>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface EscalationBarLegendaProps {
  children: ReactNode;
  color: string;
  percentage: number;
}

function EscalationBarLegenda(props: EscalationBarLegendaProps) {
  const { color, percentage, children } = props;

  return (
    <Box flexGrow={1} paddingY={1} display="flex">
      <Box flexGrow={percentage} backgroundColor={color} paddingRight={1} />
      <Box paddingLeft={2}>{children}</Box>
    </Box>
  );
}
