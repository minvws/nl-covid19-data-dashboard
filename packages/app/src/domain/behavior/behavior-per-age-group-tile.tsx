import { colors, NlBehaviorPerAgeGroup } from '@corona-dashboard/common';
import React from 'react';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { MetadataProps } from '~/components/metadata';
import { getPercentageData } from '~/components/tables/logic/get-percentage-data';
import { NarrowTable } from '~/components/tables/narrow-table';
import { WideTable } from '~/components/tables/wide-table';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { keys } from '~/utils';
import { assert } from '~/utils/assert';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { SelectBehavior } from './components/select-behavior';
import { BehaviorIdentifier } from './logic/behavior-types';

// The data for behaviour age groups does not include birth year ranges, so this has been added manually
const AGE_KEYS_NEW = [
  { ageGroup: '70_plus', birthYearRange: '-1952' },
  { ageGroup: '55_69', birthYearRange: '1953-1967' },
  { ageGroup: '40_54', birthYearRange: '1968-1983' },
  { ageGroup: '25_39', birthYearRange: '1983-1998' },
  { ageGroup: '16_24', birthYearRange: '1998-2007' },
] as const;

interface BehaviorPerAgeGroupProps {
  title: string;
  description: string;
  data: NlBehaviorPerAgeGroup;
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
  text: Pick<SiteText['pages']['behavior_page'], 'nl' | 'shared'>;
  metadata: MetadataProps;
}

export function BehaviorPerAgeGroup({ title, description, data, currentId, setCurrentId, text, metadata }: BehaviorPerAgeGroupProps) {
  const breakpoints = useBreakpoints();
  const { commonTexts, formatPercentage } = useIntl();
  const complianceValue = data[`${currentId}_compliance` as keyof typeof data] || undefined;
  const supportValue = data[`${currentId}_support` as keyof typeof data] || undefined;

  assert(typeof complianceValue !== 'number', `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (complianceValue)`);
  assert(typeof supportValue !== 'number', `[${BehaviorPerAgeGroup.name}] There is a problem by filtering the numbers out (supportValue)`);

  const hasComplianceValues = complianceValue && keys(complianceValue).every((key) => complianceValue[key] === null) === false;
  const hasSupportValues = supportValue && keys(supportValue).every((key) => supportValue[key] === null) === false;
  const dataAvailable = hasComplianceValues || hasSupportValues;
  const requiredData = AGE_KEYS_NEW.map((age, index) => {
    return {
      id: `${age.ageGroup}-${index}`,
      compliancePercentage: complianceValue?.[age.ageGroup],
      supportPercentage: supportValue?.[age.ageGroup],
      age_group_total: null, // Passing null as the dataset does not contain information about the total number of people in an age group.
      age_group_range: text.shared.leeftijden.tabel[age.ageGroup],
      birthyear_range: age.birthYearRange,
    };
  });

  const titles = { first: 'Coronaregel volgen', second: 'Coronaregel steunen' };
  const colorValues = { first: colors.blue6, second: colors.yellow3 };
  const percentageKeys = {
    first: { propertyKey: 'compliancePercentage', shouldFormat: true },
    second: { propertyKey: 'supportPercentage', shouldFormat: true },
  };
  const percentageData = getPercentageData(requiredData, titles, colorValues, percentageKeys, undefined, commonTexts.common.no_data, formatPercentage);

  return (
    <ChartTile title={title} description={description} metadata={metadata}>
      <Box spacing={4} width="100%">
        <SelectBehavior label={text.nl.select_behaviour_label} value={currentId} onChange={setCurrentId} />

        <Box overflow="auto">
          {dataAvailable ? (
            breakpoints.lg ? (
              <WideTable
                headerText={{
                  firstColumn: text.shared.leeftijden.tabel.age_group,
                  secondColumn: 'Coronaregel volgen',
                  thirdColumn: 'Coronaregel steunen',
                  fourthColumn: '',
                }}
                tableData={requiredData}
                percentageData={percentageData}
                hasAgeGroups
              />
            ) : (
              <NarrowTable headerText="Corona adviezen" tableData={requiredData} percentageData={percentageData} hasAgeGroups />
            )
          ) : (
            <Box display="flex" alignItems="center" minHeight="325px" maxWidth="300px" width="100%" marginX="auto">
              <Text textAlign="center">{text.shared.leeftijden.tabel.error}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </ChartTile>
  );
}
