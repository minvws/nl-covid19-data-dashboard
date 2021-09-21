import { EscalationLevelType } from '~/domain/escalation-level/common';

export function getEscalationLevelIndexKey(level: EscalationLevelType) {
  switch (level) {
    case 1:
      return '1' as const;
    case 2:
      return '2' as const;
    case 3:
      return '3' as const;
  }
}
