import fs from 'fs';
import path from 'path';
import { isDefined } from 'ts-is-present';
import { jsonBasePath } from '../base-paths';
import { RegionalRestrictions, Restrictions } from '../../../types/data';

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

  let restrictionData: Restrictions | undefined;
  try {
    restrictionData = JSON.parse(
      fs.readFileSync(sourcePath, { encoding: 'utf8' })
    );
    /* eslint-disable-next-line */
  } catch (e) {}

  if (restrictionData === undefined) {
    return [`Restrictions file '${sourcePath}' could not be parsed to JSON.`];
  }

  const restrictionIds = restrictionData.values.map((x) => x.identifier);

  const result = regionalRestrictions.values
    .map((restrictionIdentifier) => {
      if (!restrictionIds.includes(restrictionIdentifier)) {
        return `Restriction id '${restrictionIdentifier}' was not found in ${sourcePath}`;
      }
    })
    .filter(isDefined);

  return result.length ? result : undefined;
};
