import { VrEscalationLevel } from '@corona-dashboard/common';
import { useState } from 'react';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/type';
import { useIntl } from '~/intl';
import { SafetyRegionGroup } from './components/safety-region-group';
import { SafetyRegionRow } from './components/safety-region-row';
import { Select } from '~/components/select';
import css from '@styled-system/css';
import styled from 'styled-components';

export const scoreboardSortOptions = {
  location_a_to_z: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (a.safetyRegionName < b.safetyRegionName) return -1;
    if (b.safetyRegionName < a.safetyRegionName) return 1;
    return 0;
  },
  location_z_to_a: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (a.safetyRegionName > b.safetyRegionName) return -1;
    if (b.safetyRegionName > a.safetyRegionName) return 1;
    return 0;
  },
  positively_tested_high_to_low: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k as number) >
      (b.data.positive_tested_per_100k as number)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k as number) >
      (a.data.positive_tested_per_100k as number)
    )
      return 1;
    return 0;
  },
  positively_tested_low_to_high: (a: VrScoreboardData, b: VrScoreboardData) => {
    if (
      (a.data.positive_tested_per_100k as number) <
      (b.data.positive_tested_per_100k as number)
    )
      return -1;
    if (
      (b.data.positive_tested_per_100k as number) <
      (a.data.positive_tested_per_100k as number)
    )
      return 1;
    return 0;
  },
  hospital_admissions_high_to_low: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million as number) >
      (b.data.hospital_admissions_per_million as number)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million as number) >
      (a.data.hospital_admissions_per_million as number)
    )
      return 1;
    return 0;
  },
  hospital_admissions_low_to_high: (
    a: VrScoreboardData,
    b: VrScoreboardData
  ) => {
    if (
      (a.data.hospital_admissions_per_million as number) <
      (b.data.hospital_admissions_per_million as number)
    )
      return -1;
    if (
      (b.data.hospital_admissions_per_million as number) <
      (a.data.hospital_admissions_per_million as number)
    )
      return 1;
    return 0;
  },
} as const;

const scoreboardSortIdentifiers = Object.keys(
  scoreboardSortOptions
) as SortIdentifier[];

type SortIdentifier = keyof typeof scoreboardSortOptions;

export type VrScoreboardData = {
  data: VrEscalationLevel;
  safetyRegionName: string;
  vrCode: string;
};

export type ScoreboardRow = {
  escalationLevel: EscalationLevel;
  vrData: VrScoreboardData[];
};

interface ScoreboardProps {
  rows: ScoreboardRow[];
  maxHospitalAdmissionsPerMillion: number;
  maxPositiveTestedPer100k: number;
}

export function Scoreboard({
  rows,
  maxHospitalAdmissionsPerMillion,
  maxPositiveTestedPer100k,
}: ScoreboardProps) {
  const [sortOption, setSortOption] = useState<SortIdentifier>(
    Object.keys(scoreboardSortOptions)[0] as SortIdentifier
  );

  const { siteText } = useIntl();

  const sortOptions = scoreboardSortIdentifiers.map<{
    label: string;
    value: SortIdentifier;
  }>((id: SortIdentifier) => {
    const label = siteText.over_risiconiveaus.scoreboard.sort_option[id];
    return {
      label,
      value: id,
    };
  });

  return (
    <Box
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    >
      {rows.map((row) => (
        <SafetyRegionGroup
          level={row.escalationLevel}
          rowCount={row.vrData.length}
          key={row.escalationLevel}
        >
          <Box bg="tileGray">
            <Box px={{ _: '1.5rem', sm: 4 }}>
              {row.escalationLevel !== null && (
                <Box display="flex" justifyContent="row" py={3}>
                  <SelectSortContainer
                    display={{ _: 'none', lg: 'block' }}
                    flex="0 0 18rem"
                    pr={5}
                  >
                    <label>
                      {siteText.over_risiconiveaus.scoreboard.sort_label}
                    </label>
                    <Select
                      options={sortOptions}
                      onChange={setSortOption}
                      value={sortOption}
                    />
                  </SelectSortContainer>
                  <Headers />
                </Box>
              )}

              <SelectSortContainer display={{ _: 'block', lg: 'none' }} mb={3}>
                <label>
                  {siteText.over_risiconiveaus.scoreboard.sort_label}
                </label>
                <Select
                  options={sortOptions}
                  onChange={setSortOption}
                  value={sortOption}
                />
              </SelectSortContainer>
              {row.vrData
                .sort(scoreboardSortOptions[sortOption])
                .map((vr, index) => (
                  <SafetyRegionRow
                    vrData={vr}
                    key={vr.vrCode}
                    maxHospitalAdmissionsPerMillion={
                      maxHospitalAdmissionsPerMillion
                    }
                    maxPositiveTestedPer100k={maxPositiveTestedPer100k}
                    /**
                     * The "onbekend" section has no <Header /> which would
                     * result in a double border
                     */
                    hideBorder={row.escalationLevel === null && index === 0}
                  />
                ))}
            </Box>
          </Box>
        </SafetyRegionGroup>
      ))}
    </Box>
  );
}

const SelectSortContainer = styled(Box)(
  css({
    label: {
      fontSize: 1,
    },
    select: {
      fontWeight: 'bold',
      background: `url('/images/chevron-down-magenta.svg')`,
      backgroundSize: '14px 14px',
      backgroundRepeat: 'no-repeat, repeat',
      backgroundPosition: 'right 0.5em top 60%, 0 0',
    },
    'select:focus': {
      outlineColor: 'header',
      color: 'header',
    },
  })
);

const Headers = () => {
  const { siteText } = useIntl();

  return (
    <Box display={{ sm: 'flex' }} width="100%" alignItems="center">
      <Box flex="1" display="flex" flexDirection="column" mb={{ _: 2, sm: 0 }}>
        <Box display="flex" alignItems="center">
          <GetestIcon width="32px" height="32px" style={{ minWidth: '24px' }} />
          <InlineText fontWeight="bold" fontSize={{ _: 2, sm: '18px' }}>
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_positive_tests.title
            }
          </InlineText>
        </Box>
        <Box>
          <InlineText fontSize={2}>
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_positive_tests.subtitle
            }
          </InlineText>
        </Box>
      </Box>
      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <Ziekenhuis width="32px" height="32px" style={{ minWidth: '24px' }} />
          <InlineText fontWeight="bold" fontSize={{ _: 2, sm: '18px' }}>
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_hospital_admissions.title
            }
          </InlineText>
        </Box>
        <Box>
          <InlineText fontSize={2}>
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_hospital_admissions.subtitle
            }
          </InlineText>
        </Box>
      </Box>
    </Box>
  );
};
