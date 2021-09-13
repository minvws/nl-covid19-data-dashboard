import { features, isVerboseFeature } from '@corona-dashboard/common';
import path from 'path';

export const disabledMetrics = features
  .filter(isVerboseFeature)
  .filter((x) => !x.isEnabled);

export const schemaRootPath = path.join(process.cwd(), 'schema');
