import { VrEscalationLevel } from '@corona-dashboard/common';
import { EscalationLevel } from '~/domain/restrictions/type';

export type VrScoreboardData = {
  data: VrEscalationLevel;
  safetyRegionName: string;
  vrCode: string;
};

export type ScoreboardRow = {
  escalationLevel: EscalationLevel;
  vrData: VrScoreboardData[];
};
