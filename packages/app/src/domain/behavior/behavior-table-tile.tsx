import { colors, NlBehaviorValue, VrBehaviorArchived_20221019Value } from '@corona-dashboard/common';
import React, { useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { WideTable } from '~/components/tables/wide-table';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { BehaviorTrend } from './components/behavior-trend';
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
  metadata: MetadataProps;
}

export function BehaviorTableTile({ title, description, value, annotation, setCurrentId, scrollRef, text, metadata }: BehaviorTableTileProps) {
  const breakpoints = useBreakpoints(true);
  const behaviorsTableData = useBehaviorTableData(value as NlBehaviorValue);
  const titles = { first: 'Coronaregel volgen', second: 'Coronaregel steunen' };
  const colorValues = { first: colors.blue6, second: colors.yellow3 };
  const percentageKeys = {
    first: { propertyKey: 'compliancePercentage', shouldFormat: false },
    second: { propertyKey: 'supportPercentage', shouldFormat: false },
  };
  const trendDirectionKeys = {
    first: { propertyKey: 'complianceTrend' },
    second: { propertyKey: 'supportTrend' },
  };
  const percentageData = getPercentageData(behaviorsTableData, titles, colorValues, percentageKeys, trendDirectionKeys);

  const anchorButtonClickHandler = (id: BehaviorIdentifier, scrollRef: { current: HTMLDivElement | null }) => {
    scrollIntoView(scrollRef.current as Element);
    setCurrentId(id);
  };
  const onClickConfig = { handler: anchorButtonClickHandler, scrollRef: scrollRef };

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.basisregels.header_basisregel,
            secondColumn: 'Coronaregel volgen', // TODO:AP - add sanity key
            thirdColumn: 'Coronaregel steunen', // TODO:AP - add sanity key
            fourthColumn: '',
          }}
          tableData={behaviorsTableData}
          percentageData={percentageData}
          onClickConfig={onClickConfig}
          hasIcon
        />
      ) : (
        <NarrowTable tableData={behaviorsTableData} percentageData={percentageData} headerText={text.basisregels.header_basisregel} onClickConfig={onClickConfig} hasIcon />
      )}

      <Box marginTop={space[2]}>
        <Box display="flex">
          <Box display="flex" marginRight={space[3]}>
            <BehaviorTrend trend="down" text="" hasMarginRight />
            <Text variant="label1" color="gray7">
              Verschil met de vorige meting is lager
            </Text>
          </Box>

          <Box display="flex">
            <BehaviorTrend trend="up" text="" hasMarginRight />
            <Text variant="label1" color="gray7">
              Verschil met de vorige meting is hoger
            </Text>
          </Box>
        </Box>

        <Box marginTop={space[2]}>
          <Text variant="label1" color="gray7">
            {annotation}
          </Text>
        </Box>
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
