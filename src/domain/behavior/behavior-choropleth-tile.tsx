import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Select } from '~/components-styled/select';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { SafetyRegionProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { RegionsBehavior } from '~/types/data';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorType,
} from './behavior-types';
import { BehaviorTypeControl } from './components/behavior-type-control';

const text = siteText.nl_gedrag;

export function BehaviorChoroplethTile() {
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
            options={behaviorIdentifiers.map((id) => ({
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
        metricName="behavior"
        metricValueName={metricValueName}
        tooltipContent={(context: RegionsBehavior & SafetyRegionProperties) => {
          const onSelect = (event: React.MouseEvent) => {
            event.stopPropagation();
            goToRegion(context.vrcode);
          };
          const value = context[metricValueName];

          return (
            <TooltipContent title={context.vrname} onSelect={onSelect}>
              <p>
                <strong>
                  {siteText.gedrag_common[type]}:{' '}
                  {value ? `${value}%` : text.verdeling_in_nederland.onbekend}
                </strong>
              </p>
              <p>{siteText.gedrag_onderwerpen[currentId]}</p>
            </TooltipContent>
          );
        }}
        onSelect={(x) => goToRegion(x.vrcode)}
      />
    </ChoroplethTile>
  );
}
