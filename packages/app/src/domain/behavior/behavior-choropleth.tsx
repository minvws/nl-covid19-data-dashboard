import { Box } from '~/components/base';
import { Tile } from '~/components/tile';
import { Text, Heading } from '~/components/typography';
import { useEffect, useState } from 'react';
import {
  RegionsBehavior,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { useReverseRouter } from '~/utils/use-reverse-router';
import css from '@styled-system/css';
import { BehaviorTooltip } from '~/components/choropleth/tooltips/region/behavior-tooltip';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { BehaviorIdentifier } from './behavior-types';

const blacklistedItems = [
  'symptoms_get_tested',
  'symptoms_stay_home',
  'wear_mask_public_transport',
];
interface BehaviorChoroplethProps {
  title: string;
  description: string;
  data: RegionsBehavior[];
}

export function BehaviorChoropleth({
  title,
  description,
  data,
  sorted,
}: BehaviorChoroplethProps) {
  const [currentMetric, setCurrentMetric] = useState(sorted[4]);
  const [isMetricAvaliable, setIsMetricAvaliable] = useState(true);

  const changeMetric = (newMetric: BehaviorIdentifier) =>
    setCurrentMetric(sorted.find((x) => x.id === newMetric));

  useEffect(() => {
    setIsMetricAvaliable(!blacklistedItems.includes(currentMetric.id));
  }, [currentMetric]);

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{description}</Text>
      </Box>
      <form>
        <select
          onChange={(event) =>
            changeMetric(event.target.value as BehaviorIdentifier)
          }
          value={currentMetric.description}
        >
          <option key={'empty'} value={'empty'}>
            empty
          </option>
          {sorted.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.description}
            </option>
          ))}
        </select>
      </form>

      <Box display="flex" flexWrap="wrap">
        <ChoroplethBlock
          data={{ behavior_compliance: data }}
          metricName="compliance"
          currentMetric={currentMetric}
          isMetricAvaliable={isMetricAvaliable}
          title="Naleving van de regels"
          threshold={regionThresholds.behavior_compliance}
        />
        <ChoroplethBlock
          data={{ behavior_support: data }}
          metricName="support"
          currentMetric={currentMetric}
          isMetricAvaliable={isMetricAvaliable}
          title="Draagvlak van de regels"
          threshold={regionThresholds.behavior_support}
        />
      </Box>
    </Tile>
  );
}

interface ChoroplethBlockProps {
  data: any;
  metricName: any;
  currentMetric: any;
  isMetricAvaliable: any;
  title: any;
  threshold: any;
}

function ChoroplethBlock({
  data,
  metricName,
  currentMetric,
  isMetricAvaliable,
  title,
  threshold,
}: ChoroplethBlockProps) {
  const reverseRouter = useReverseRouter();

  return (
    <Box width={{ _: '100%', lg: '50%' }}>
      <Heading level={4} textAlign="center">
        {title}
      </Heading>
      <Box position="relative">
        {!isMetricAvaliable && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top={0}
            width="100%"
            height="100%"
            css={css({ zIndex: 9 })}
          >
            <Text textAlign="center" m={0} css={css({ maxWidth: '300px' })}>
              Op dit moment is er geen data beschikbaar voor deze basisregel per
              regio
            </Text>
          </Box>
        )}
        <SafetyRegionChoropleth
          data={data}
          getLink={reverseRouter.vr.gedrag}
          metricName={`behavior_${metricName}` as any}
          metricProperty={`${currentMetric.id}_${metricName}`}
          minHeight={400}
          tooltipContent={(
            context: RegionsBehavior & SafetyRegionProperties
          ) => {
            const currentComplianceValue = `${currentMetric.id}_compliance` as keyof RegionsBehavior;
            const currentSupportValue = `${currentMetric.id}_support` as keyof RegionsBehavior;

            if (!isMetricAvaliable) return null;

            return (
              <BehaviorTooltip
                context={context}
                currentMetric={currentMetric}
                currentComplianceValue={context[currentComplianceValue]}
                currentSupportValue={context[currentSupportValue]}
              />
            );
          }}
        />
      </Box>
      <ChoroplethLegenda thresholds={threshold} title={'Percentage'} />
    </Box>
  );
}
