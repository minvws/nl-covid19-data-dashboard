import { colors, NlBehaviorPerAgeGroup } from '@corona-dashboard/common';
import React from 'react';
import { AgeGroup } from '~/components/age-groups/age-group';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { getBirthYearRange } from '~/components/tables/logic/get-birth-year-range';
import { useGetPercentageData } from '~/components/tables/logic/use-get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { TableData } from '~/components/tables/types';
import { WideTable } from '~/components/tables/wide-table';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { keys } from '~/utils';
import { assert } from '~/utils/assert';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

const AGE_GROUPS_KEYS = ['70_plus', '55_69', '40_54', '25_39', '16_24'] as const;

interface BehaviorPerAgeGroupProps {
  title: string;
  description: string;
  data: NlBehaviorPerAgeGroup;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  text: SiteText['pages']['behavior_page']['nl'];
  metadata: MetadataProps;
}

export const BehaviorPerAgeGroup = ({ title, description, data, currentId, setCurrentId, text, metadata }: BehaviorPerAgeGroupProps) => {
  const breakpoints = useBreakpoints();
  const complianceValue = data[`${currentId}_compliance` as keyof typeof data];
  const supportValue = data[`${currentId}_support` as keyof typeof data];

  assert(typeof complianceValue !== 'number', `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (complianceValue)`);
  assert(typeof supportValue !== 'number', `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (supportValue)`);

  const hasComplianceValues = complianceValue && keys(complianceValue).every((key) => complianceValue[key] === null) === false;
  const hasSupportValues = supportValue && keys(supportValue).every((key) => supportValue[key] === null) === false;
  const dataAvailable = hasComplianceValues || hasSupportValues;
  const AGE_GROUPS_BIRTH_RANGES = AGE_GROUPS_KEYS.map((ageGroup) => ({ ageGroup, birthYearRange: getBirthYearRange(ageGroup) }));

  const requiredData: TableData[] = AGE_GROUPS_BIRTH_RANGES.map((age, index) => {
    return {
      id: `${age.ageGroup}-${index}`,
      firstPercentage: complianceValue?.[age.ageGroup] ?? null,
      secondPercentage: supportValue?.[age.ageGroup] ?? null,
      firstColumnLabel: <AgeGroup range={text.leeftijden.tabel[age.ageGroup]} birthYearRange={age.birthYearRange} />,
    };
  });

  const percentageTitles = { first: text.basisregels.rules_followed, second: text.basisregels.rules_supported };
  const percentageColors = { first: colors.blue6, second: colors.yellow3 };
  const percentageFormattingRules = { first: { shouldFormat: true }, second: { shouldFormat: true } };
  const percentageData = useGetPercentageData(requiredData, percentageTitles, percentageColors, percentageFormattingRules);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      <Box spacing={4} width="100%">
        <Box paddingRight={space[3]} width={breakpoints.lg ? '50%' : '100%'}>
          <SelectBehavior label={text.select_behaviour_label} value={currentId} onChange={setCurrentId} />
        </Box>

        <Box overflow="auto">
          {dataAvailable ? (
            breakpoints.lg ? (
              <WideTable
                headerText={{
                  firstColumn: text.leeftijden.tabel.age_group,
                  secondColumn: text.basisregels.rules_followed,
                  thirdColumn: text.basisregels.rules_supported,
                  fourthColumn: text.basisregels.percentage_bar_column_header,
                }}
                tableData={requiredData}
                percentageData={percentageData}
              />
            ) : (
              <NarrowTable headerText={text.tabel_per_leeftijdsgroep.narrow_table_header} tableData={requiredData} percentageData={percentageData} />
            )
          ) : (
            <Box display="flex" alignItems="center" minHeight="325px" maxWidth="300px" width="100%" marginX="auto">
              <Text textAlign="center">{text.leeftijden.tabel.error}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </ChartTile>
  );
};
