import { VrEscalationLevel } from '@corona-dashboard/common';
import { flatten } from 'lodash';
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

export function Scoreboard({ rows }: { rows: ScoreboardRow[] }) {
  const vrData = flatten(rows.map((row) => row.vrData)).map((vr) => vr.data);

  const maxHospitalAdmissionsPerMillion = Math.max(
    ...vrData.map((data) => data.hospital_admissions_per_million)
  );
  const maxPositiveTestedPer100k = Math.max(
    ...vrData.map((data) => data.positive_tested_per_100k)
  );

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
            <Box p={{ _: 3, sm: 4 }}>
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
      pb={3}
      pl={{ lg: '18rem' }}
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
