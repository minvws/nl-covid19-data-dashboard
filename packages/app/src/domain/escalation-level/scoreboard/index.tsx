import { VrEscalationLevel } from '@corona-dashboard/common';
import { Box } from '~/components/base';
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
        <Collapsible level={lvl.escalatationLevel} count={lvl.vrData.length}>
          <Box bg="tileGray" p={-2}>
            <Box p={4}>
              <Headers />
              {lvl.vrData.map((vr) => (
                <SafetyRegionRow vrData={vr} />
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
    <Box display="flex" width="100%" alignItems="center">
      <Box flex="0.8" />
      <Box flex="1">Positieve testen</Box>
      <Box flex="1">Ziekenhuisopnames</Box>
    </Box>
  );
};
