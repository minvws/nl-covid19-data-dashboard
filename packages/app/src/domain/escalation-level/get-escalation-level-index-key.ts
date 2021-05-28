import { EscalationLevel } from '../restrictions/type';

export function getEscalationLevelIndexKey(level: EscalationLevel) {
  switch (level) {
    case 1:
      return '1' as const;
    case 2:
      return '2' as const;
    case 3:
      return '3' as const;
    case 4:
      return '4' as const;
    case null:
      return 'onbekend' as const;
  }
}
