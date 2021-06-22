import { useMemo } from 'react';
import { useIntl } from '~/intl';
import { behaviorIdentifiers } from './behavior-types';

/**
 * A hook returning keys in order to look up values in the behavior
 * data.
 * Additionaly it will return the behavior key/id and description because
 * why not.
 */
export function useBehaviorLookupKeys() {
  const intl = useIntl();

  return useMemo(() => {
    return behaviorIdentifiers.map((key) => ({
      key,
      description: intl.siteText.gedrag_onderwerpen[key],
      complianceKey: `${key}_compliance` as const,
      supportKey: `${key}_support` as const,
    }));
  }, [intl]);
}
