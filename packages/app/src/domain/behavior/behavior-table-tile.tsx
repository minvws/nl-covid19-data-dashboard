import { colors, NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import React, { useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { WideTable } from '~/components/tables/wide-table';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { BehaviorIdentifier } from './logic/behavior-types';
import { useBehaviorLookupKeys } from './logic/use-behavior-lookup-keys';

interface BehaviorTableTileProps {
  title: string;
  description: string;
  complianceExplanation: string;
  supportExplanation: string;
  value: NlBehaviorValue | VrBehaviorArchived_20221019Value;
  annotation: string;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
  text: SiteText['pages']['behavior_page']['shared'];
}

export function BehaviorTableTile({ title, description, value, annotation, setCurrentId, scrollRef, text }: BehaviorTableTileProps) {
  const breakpoints = useBreakpoints(true);
  const behaviorsTableData = useBehaviorTableData(value as NlBehaviorValue);
  const titles = { first: 'Coronaregel volgen', second: 'Coronaregel steunen' };
  const colorValues = { first: colors.blue6, second: colors.yellow3 };
  const percentageKeys = { 
    first: { propertyKey: 'compliancePercentage', shouldFormat: false },
    second: { propertyKey: 'supportPercentage', shouldFormat: false }
  }
  const trendDirectionKeys = {
    first: { propertyKey: 'complianceTrend' },
    second: { propertyKey: 'supportTrend' }
  }
  const percentageData = getPercentageData(behaviorsTableData, titles, colorValues, percentageKeys, trendDirectionKeys);
  
  const anchorButtonClickHandler = (id: BehaviorIdentifier, scrollRef: { current: HTMLDivElement | null }) => {
    scrollIntoView(scrollRef.current as Element);
    setCurrentId(id);
  };

  return (
    <ChartTile title={title} description={description}>
      {breakpoints.lg ? (
        <WideTable 
          headerText={{
            firstColumn: 'Corona adviezen',
            secondColumn: 'Coronaregel volgen',
            thirdColumn: 'Coronaregel steunen',
            fourthColumn: ''
          }}
          tableData={behaviorsTableData}
          percentageData={percentageData}
          onClickConfig={{
            handler: anchorButtonClickHandler,
            scrollRef: scrollRef
          }}
          hasIcon
        />
      ) : (
        <NarrowTable
          tableData={behaviorsTableData}
          percentageData={percentageData}
          headerText={text.basisregels.header_basisregel}
          onClickConfig={{
            handler: anchorButtonClickHandler,
            scrollRef: scrollRef
          }}
          hasIcon
        />
      )}

      <Box marginTop={space[2]} maxWidth="maxWidthText">
        <Text variant="label1" color="gray7">
          {annotation}
        </Text>
      </Box>
    </ChartTile>
  );
}


function useBehaviorTableData(value: NlBehaviorValue) {
  const behaviorLookupKeys = useBehaviorLookupKeys();

  return useMemo(() => {
    return behaviorLookupKeys
      .map((x) => {
        const compliancePercentage = value[x.complianceKey];
        const complianceTrend = value[`${x.complianceKey}_trend` as const];

        const supportPercentage = value[x.supportKey];
        const supportTrend = value[`${x.supportKey}_trend` as const];

        if (isPresent(supportPercentage) && isDefined(supportTrend) && isPresent(compliancePercentage) && isDefined(complianceTrend)) {
          return {
            id: x.key,
            description: x.description,
            compliancePercentage,
            complianceTrend,
            supportPercentage,
            supportTrend,
          };
        }
      })
      .filter(isDefined)
      .sort((a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0));
  }, [value, behaviorLookupKeys]);
}
