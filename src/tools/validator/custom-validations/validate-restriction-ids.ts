import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { jsonBasePath } from '../base-paths';
import { RegionalRestrictions } from '../../../types/data';

export const validateRestrictionIds = (
  input: Record<string, unknown>
): string[] | undefined => {
  if (!input.restrictions) {
    return [`Property 'restrictions' doesn't exist`];
  }
  const regionalRestrictions = input.restrictions as RegionalRestrictions;

  const sourcePath = path.join(jsonBasePath, 'RESTRICTIONS.js');
  if (!fs.existsSync(sourcePath)) {
    return [
      `Restrictions file '${sourcePath}' does not exist, unable to validate region restrictions.`,
    ];
  }

  try {
    const restrictionData: RegionalRestrictions = JSON.parse(
      fs.readFileSync(sourcePath, { encoding: 'utf8' })
    );

    const restrictionIds = restrictionData.values.map((x) => x.restriction_id);

    const result = regionalRestrictions.values
      .map((value) => {
        if (!restrictionIds.includes(value.restriction_id)) {
          return `Restriction id '${value.restriction_id}' was not found in ${sourcePath}`;
        }
      })
      .filter(isDefined);

    return result.length ? result : undefined;
  } catch (e) {
    return [`Restrictions file '${sourcePath}' could not be parsed to JSON.`];
  }
};
