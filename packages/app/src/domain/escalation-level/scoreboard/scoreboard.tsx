import css from '@styled-system/css';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import { Select } from '~/components/select';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { VrGroup } from './components/vr-group';
import { VrRow } from './components/vr-row';
import { scoreboardSortOptions, SortIdentifier } from './logic';
import { ScoreboardRowData } from './types';

interface ScoreboardProps {
  rows: ScoreboardRowData[];
  maxHospitalAdmissionsPerMillion: number;
  maxPositiveTestedPer100k: number;
}

export function Scoreboard({
  rows,
  maxHospitalAdmissionsPerMillion,
  maxPositiveTestedPer100k,
}: ScoreboardProps) {
  const [sortOption, setSortOption] =
    useState<SortIdentifier>('location_a_to_z');

  const { siteText } = useIntl();

  const sortOptions = useMemo(() => {
    const scoreboardSortIdentifiers = Object.keys(
      scoreboardSortOptions
    ) as SortIdentifier[];

    return scoreboardSortIdentifiers.map((id) => {
      const label = siteText.over_risiconiveaus.scoreboard.sort_option[id];
      return {
        label,
        value: id,
      };
    });
  }, [siteText]);

  return (
    <Box
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    >
      {rows.map((row) => (
        <VrGroup
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
                  <VrRow
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
        </VrGroup>
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

function Headers() {
  const { siteText } = useIntl();

  return (
    <Box display={{ sm: 'flex' }} width="100%" alignItems="center">
      <Box flex="1" display="flex" flexDirection="column" mb={{ _: 2, sm: 0 }}>
        <Box display="flex" alignItems="center">
          <GetestIcon width="32px" height="32px" style={{ minWidth: '24px' }} />
          <InlineText fontWeight="bold" variant="body1">
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_positive_tests.title
            }
          </InlineText>
        </Box>
        <Box>
          <InlineText>
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
          <InlineText fontWeight="bold" variant="body1">
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_hospital_admissions.title
            }
          </InlineText>
        </Box>
        <Box>
          <InlineText>
            {
              siteText.over_risiconiveaus.scoreboard.current_level
                .header_hospital_admissions.subtitle
            }
          </InlineText>
        </Box>
      </Box>
    </Box>
  );
}
