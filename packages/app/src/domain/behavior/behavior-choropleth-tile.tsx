import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Select } from '~/components-styled/select';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import siteText from '~/locale/index';
import { RegionsBehavior } from '@corona-dashboard/common';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorTypeControl } from './components/behavior-type-control';
import css from '@styled-system/css';

const text = siteText.nl_gedrag;

export function BehaviorChoroplethTile({
  data,
}: {
  data: { behavior: RegionsBehavior[] };
}) {
  const [type, setType] = useState<BehaviorType>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const router = useRouter();

  const metricValueName = `${currentId}_${type}` as keyof RegionsBehavior;

  function goToRegion(vrcode: string) {
    router.push(`/veiligheidsregio/${vrcode}/gedrag`);
  }

  return (
    <ChoroplethTile
      title={text.verdeling_in_nederland.titel}
      description={
        <>
          <Box display="flex" justifyContent="start">
            <BehaviorTypeControl value={type} onChange={setType} />
          </Box>
          <p>{text.verdeling_in_nederland.intro}</p>
          <Select
            value={currentId}
            onChange={setCurrentId}
            options={behaviorIdentifiers
              .filter((id) =>
                // filter the dropdown to only show behaviors with data
                data.behavior.find((data) => {
                  const key = `${id}_${type}` as keyof RegionsBehavior;
                  return typeof data[key] === 'number';
                })
              )
              .map((id) => ({
                value: id,
                label: siteText.gedrag_onderwerpen[id],
              }))}
          />
        </>
      }
      legend={{
        thresholds: regionThresholds.behavior,
        title: text.verdeling_in_nederland.legenda_titel,
      }}
    >
      <SafetyRegionChoropleth
        data={data}
        metricName="behavior"
        metricProperty={metricValueName}
        tooltipContent={(context: RegionsBehavior & SafetyRegionProperties) => {
          const onSelect = (event: React.MouseEvent) => {
            event.stopPropagation();
            goToRegion(context.vrcode);
          };
          const value = context[metricValueName];

          return (
            <TooltipContent title={context.vrname} onSelect={onSelect}>
              <Text m={0} css={css({ fontWeight: 'bold' })}>
                {siteText.gedrag_common[type]}:{' '}
                {value ? `${value}%` : text.verdeling_in_nederland.onbekend}
              </Text>
              <Text m={0}>{siteText.gedrag_onderwerpen[currentId]}</Text>
            </TooltipContent>
          );
        }}
        onSelect={goToRegion}
      />
    </ChoroplethTile>
  );
}
