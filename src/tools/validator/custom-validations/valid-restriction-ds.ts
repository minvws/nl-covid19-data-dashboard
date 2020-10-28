import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { jsonBasePath } from '../base-paths';

export const validRestrictionIds = (
  input: Record<string, unknown>
): string[] | undefined => {
  if (!input.restrictions) {
    return [`Property 'restrictions' doesn't exist`];
  }
  const regionRestrictions = input.restrictions as any;

  const sourcePath = path.join(jsonBasePath, 'RESTRICTIONS.js');
  if (!fs.existsSync(sourcePath)) {
    return [
      `Restrictions file '${sourcePath}' does not exist, unable to validate region restrictions.`,
    ];
  }

  const restrictionData = JSON.parse(
    fs.readFileSync(sourcePath, { encoding: 'utf8' })
  );

  const restrictionIds = (restrictionData.values as any[]).map(
    (value: any) => value.identifier
  );

  const result = (regionRestrictions.values as any[])
    .map((id: number) => {
      if (!restrictionIds.includes(id)) {
        return `Restriction id '${id}' was not found in ${sourcePath}`;
      }
    })
    .filter(isDefined);

  return result.length ? result : undefined;
};
