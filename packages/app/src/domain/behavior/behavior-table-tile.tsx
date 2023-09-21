import { colors, ArchivedNlBehaviorValue } from '@corona-dashboard/common';
import React, { useMemo } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { useGetPercentageData } from '~/components/tables/logic/use-get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { TableData } from '~/components/tables/types';
import { WideTable } from '~/components/tables/wide-table';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { BehaviorIconWithLabel, OnClickConfig } from './components/behavior-icon-with-label';
import { BehaviorTrend } from './components/behavior-trend';
import { BehaviorIdentifier } from './logic/behavior-types';
import { useBehaviorLookupKeys } from './logic/use-behavior-lookup-keys';

interface BehaviorTableTileProps {
  title: string;
  description: string;
  value: ArchivedNlBehaviorValue;
  annotation: string;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  scrollRef: { current: HTMLDivElement | null };
  text: SiteText['pages']['behavior_page']['nl'];
  metadata: MetadataProps;
}

export const BehaviorTableTile = ({ title, description, value, annotation, setCurrentId, scrollRef, text, metadata }: BehaviorTableTileProps) => {
  const breakpoints = useBreakpoints(true);
  const behaviorsTableData: TableData[] = useBehaviorTableData(value as ArchivedNlBehaviorValue, { scrollRef, setCurrentId });
  const titles = { first: text.basisregels.rules_followed, second: text.basisregels.rules_supported };
  const colorValues = { first: colors.blue6, second: colors.yellow3 };
  const percentageData = useGetPercentageData(behaviorsTableData, titles, colorValues);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      {breakpoints.lg ? (
        <WideTable
          headerText={{
            firstColumn: text.basisregels.header_basisregel,
            secondColumn: text.basisregels.rules_followed,
            thirdColumn: text.basisregels.rules_supported,
            fourthColumn: text.basisregels.percentage_bar_column_header,
          }}
          tableData={behaviorsTableData}
          percentageData={percentageData}
        />
      ) : (
        <NarrowTable tableData={behaviorsTableData} percentageData={percentageData} headerText={text.basisregels.header_basisregel} />
      )}

      <Box marginTop={space[3]}>
        <Box display="flex">
          <Box display="flex" marginRight={space[3]}>
            <BehaviorTrend trend="down" text="" hasMarginRight />
            <Text variant="label1" color={colors.gray7}>
              {text.basisregels.footer_trend_down_annotation}
            </Text>
          </Box>

          <Box display="flex">
            <BehaviorTrend trend="up" text="" hasMarginRight />
            <Text variant="label1" color={colors.gray7}>
              {text.basisregels.footer_trend_up_annotation}
            </Text>
          </Box>
        </Box>

        <Box marginTop={space[2]}>
          <Text variant="label1" color={colors.gray7}>
            {annotation}
          </Text>
        </Box>
      </Box>
    </ChartTile>
  );
};

function useBehaviorTableData(value: ArchivedNlBehaviorValue, onClickConfig: OnClickConfig) {
  const behaviorLookupKeys = useBehaviorLookupKeys();

  return useMemo(() => {
    return behaviorLookupKeys
      .map((lookupKey) => {
        const compliancePercentage = value[lookupKey.complianceKey];
        const complianceTrend = value[`${lookupKey.complianceKey}_trend` as const];

        const supportPercentage = value[lookupKey.supportKey];
        const supportTrend = value[`${lookupKey.supportKey}_trend` as const];

        if (isPresent(supportPercentage) && isDefined(supportTrend) && isPresent(compliancePercentage) && isDefined(complianceTrend)) {
          return {
            id: lookupKey.key,
            description: lookupKey.description,
            firstPercentage: compliancePercentage,
            firstPercentageTrend: complianceTrend,
            secondPercentage: supportPercentage,
            secondPercentageTrend: supportTrend,
            firstColumnLabel: <BehaviorIconWithLabel id={lookupKey.key} description={lookupKey.description} onClickConfig={onClickConfig} />,
          };
        }
      })
      .filter(isDefined)
      .sort((a, b) => (b.firstPercentage ?? 0) - (a.firstPercentage ?? 0));
  }, [value, behaviorLookupKeys, onClickConfig]);
}
