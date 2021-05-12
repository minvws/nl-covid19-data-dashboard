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

export type ScoreBoardData = {
  escalationLevel: 1 | 2 | 3 | 4;
  vrData: VrScoreboardData[];
};

export function Scoreboard({ data }: { data: ScoreBoardData[] }) {
  return (
    <Box
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    >
      {data.map((lvl) => (
        <Collapsible
          level={lvl.escalationLevel}
          rowCount={lvl.vrData.length}
          key={lvl.escalationLevel}
        >
          <Box bg="tileGray">
            <Box p={{ _: 3, sm: 4 }}>
              <Headers />
              {lvl.vrData.map((vr) => (
                <SafetyRegionRow vrData={vr} key={vr.vrCode} />
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
    <Box display="flex" width="100%" alignItems="center" pb={3}>
      <Box flex={{ _: 0, lg: 0.8 }} />
      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <GetestIcon width="32px" height="32px" style={{ minWidth: '24px' }} />
          <InlineText>
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
          <InlineText>
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
};
