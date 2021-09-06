import { features } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

const disabledMetrics = features.filter((x) => !x.isEnabled);

type DataKind = 'nl' | 'gm' | 'vr' | 'in';

export function initializeFeatureFlaggedData(jsonData: any, kind: DataKind) {
  if (!isDefined(jsonData)) {
    return;
  }

  return jsonData;
}
