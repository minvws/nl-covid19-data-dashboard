import { Path } from 'sanity';
import { isDefined } from 'ts-is-present';

export const validateLocaleTextPlaceholders = ({ en, nl }: { en?: string; nl?: string }): true | { message: string; paths: Path[] } => {
  const enErrors = getFaultyParameterPlaceholders(en);
  const nlErrors = getFaultyParameterPlaceholders(nl);

  if (enErrors.length) {
    const variables = enErrors.map((error) => `"${error}"`).join(', ');
    return {
      message: `De volgende variabelen zijn niet juist geformatteerd: ${variables}`,
      paths: [['en']],
    };
  }

  if (nlErrors.length) {
    const variables = nlErrors.map((error) => `"${error}"`).join(', ');
    return {
      message: `De volgende variabelen zijn niet juist geformatteerd: ${variables}`,
      paths: [['nl']],
    };
  }

  return true;
};

/**
 * A valid placeholder is considered looks like: **{{placeholderName}}**.
 * This validator looks for mistakes such as **{placeHolderName}}** or **{{placeHolderName}}}**.
 */
const getFaultyParameterPlaceholders = (text = '') => {
  const faultyVariables = [...text.matchAll(/{+[^}]+}+/g)]
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return;
    })
    .filter(isDefined);

  return faultyVariables;
};
