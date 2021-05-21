import { VrEscalationLevel } from '@corona-dashboard/common';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Collapsible } from './components/collapsible';
import { SafetyRegionRow } from './components/safety-region-row';

export type VrScoreboardData = {
  data: VrEscalationLevel;
  safetyRegionName: string;
  vrCode: string;
};

export type ScoreboardRow = {
  escalationLevel: 1 | 2 | 3 | 4;
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
  return (
    <Box
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    >
      {rows.map((row) => (
        <Collapsible
          level={row.escalationLevel}
          rowCount={row.vrData.length}
          key={row.escalationLevel}
        >
          <Box bg="tileGray">
            <Box px={{ _: '1.5rem', sm: 4 }} pb={2}>
              <Headers />
              {row.vrData.map((vr) => (
                <SafetyRegionRow
                  vrData={vr}
                  key={vr.vrCode}
                  maxHospitalAdmissionsPerMillion={
                    maxHospitalAdmissionsPerMillion
                  }
                  maxPositiveTestedPer100k={maxPositiveTestedPer100k}
                />
              ))}
            </Box>
          </Box>
        </Collapsible>
      ))}
    </Box>
  );
}

const Headers = () => {
  const { siteText } = useIntl();

  return (
    <Box
      display={{ sm: 'flex' }}
      width="100%"
      alignItems="center"
      pl={{ lg: '18rem' }}
      py={3}
    >
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
