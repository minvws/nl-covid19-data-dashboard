import { VrEscalationLevel } from '@corona-dashboard/common';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { Collapsible } from './components/collapsible';
import { SafetyRegionRow } from './components/safety-region-row';

export type VrScoreboardData = {
  data: VrEscalationLevel;
  safetyRegionName: string;
  vrCode: string;
};

export type ScoreBoardData = {
  escalatationLevel: 1 | 2 | 3 | 4;
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
          level={lvl.escalatationLevel}
          count={lvl.vrData.length}
          key={lvl.escalatationLevel}
        >
          <Box bg="tileGray" p={-2}>
            <Box p={4}>
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
  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      pb={3}
    >
      <Box flex={{ _: 0, lg: 0.8 }} />
      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <GetestIcon width="32px" height="32px" />
          <InlineText>Positieve testen</InlineText>
        </Box>
        <Box>
          <InlineText>per 100.000 inwoners / week</InlineText>
        </Box>
      </Box>
      <Box flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <Ziekenhuis width="32px" height="32px" />
          <InlineText>Ziekenhuisopnames</InlineText>
        </Box>
        <Box>
          <InlineText>per 1 miljoen inwoners / week</InlineText>
        </Box>
      </Box>
    </Box>
  );
};
