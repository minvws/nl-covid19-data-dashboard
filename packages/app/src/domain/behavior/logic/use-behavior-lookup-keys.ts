import { useMemo } from 'react';
import { useIntl } from '~/intl';
import { behaviorIdentifiers } from './behavior-types';

/**
 * A hook returning keys in order to look up values in the behavior
 * data.
 * Additionally it will return the behavior key/id and description because
 * why not.
 */
export function useBehaviorLookupKeys() {
  const { siteText } = useIntl();

  return useMemo(() => {
    return behaviorIdentifiers.map((key) => ({
      key,
      description: siteText.pages.behaviorPage.shared.onderwerpen[key],
      complianceKey: `${key}_compliance` as const,
      supportKey: `${key}_support` as const,
    }));
  }, [siteText.pages.behaviorPage.shared.onderwerpen]);
}
