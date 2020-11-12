import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Select } from '~/components-styled/select';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
// import { NationalBehaviorValue } from '~/types/data';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  GedragText,
} from './behavior-types';
import {
  BehaviorTypeControl,
  BehaviorTypeControlOption,
} from './components/behavior-type-control';

interface BehaviorChoroplethTileProps {
  text: GedragText;
  // value: NationalBehaviorValue;
}

export function BehaviorChoroplethTile({
  text,
}: // value,
BehaviorChoroplethTileProps) {
  const router = useRouter();
  const [type, setType] = useState<BehaviorTypeControlOption>('compliance');
  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const legendItems = useSafetyRegionLegendaData('behavior');

  const metricValueName = `${currentId}_${type}`;

  function gotoRegion(vrcode: string) {
    router.push(
      '/veiligheidsregio/[code]/gedrag',
      `/veiligheidsregio/${vrcode}/gedrag`
    );
  }

  return (
    <ChoroplethTile
      title={'titel'}
      description={
        <>
          <Box display="flex" justifyContent="start">
            <BehaviorTypeControl value={type} onChange={setType} />
          </Box>
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
      legend={
        legendItems // this data value should probably not be optional
          ? {
              title: 'legenda_titel',
              items: legendItems,
            }
          : undefined
      }
    >
      <SafetyRegionChoropleth
        metricName="behavior"
        metricValueName={metricValueName}
        tooltipContent={(context: any) => {
          const onSelect = (event: React.MouseEvent) => {
            event.stopPropagation();
            gotoRegion(context.vrcode);
          };

          return (
            <TooltipContent title={context.vrname} onSelect={onSelect}>
              <p>
                <strong>
                  {text.common[type]}: {context[metricValueName]}%
                </strong>
              </p>
              <p>{siteText.gedrag_onderwerpen[currentId]}</p>
            </TooltipContent>
          );
        }}
        onSelect={(x) => gotoRegion(x.vrcode)}
      />
    </ChoroplethTile>
  );
}
