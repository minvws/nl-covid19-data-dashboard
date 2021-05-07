import { VrEscalationLevel } from '@corona-dashboard/common';
import { Collapsible } from './collapsible';

export type VrScoreboardData = {
  data: VrEscalationLevel;
  safetyRegionName: string;
  vrCode: string;
};

export type ScoreBoardData = {
  escalatationLevel: 1 | 2 | 3 | 4;
  vrData: VrScoreboardData[];
};

type ScoreboardProps = {
  data: ScoreBoardData[];
};

export function Scoreboard(props: ScoreboardProps) {
  const { data } = props;
  return (
    <>
      {data.map((lvl) => (
        <Collapsible level={lvl.escalatationLevel} count={lvl.vrData.length}>
          {lvl.vrData.map((vr) => (
            <div>{vr.safetyRegionName}</div>
          ))}
        </Collapsible>
      ))}
    </>
  );
}
