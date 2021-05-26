import { isDefined, isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import {
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
  BehaviorTrendType,
  BehaviorType,
} from './behavior-types';

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

interface BehaviorFormatted {
  id: BehaviorIdentifier;
  description: string;
  percentage: number;
  trend?: BehaviorTrendType;
}

/* Format raw list of behaviors into list for compliance or for support */
export function useFormatBehaviorType(
  behavior: BehaviorValue,
  type: BehaviorType
): BehaviorFormatted[] {
  const { siteText } = useIntl();

  return behaviorIdentifiers
    .map((identifier) => {
      const percentage = behavior[
        `${identifier}_${type}` as keyof BehaviorValue
      ] as number | null;
      const trend = (behavior[
        `${identifier}_${type}_trend` as keyof BehaviorValue
      ] ?? undefined) as BehaviorTrendType | null;

      return isPresent(percentage)
        ? {
            id: identifier,
            description: siteText.gedrag_onderwerpen[identifier],
            percentage,
            trend: trend || undefined,
          }
        : undefined;
    })
    .filter(isDefined);
}

/* Sort lists of formatted compliance and support behaviors */
export function sortBehavior(
  compliance: BehaviorFormatted[],
  support: BehaviorFormatted[]
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  /* Sort compliance on percentage, decreasing; percentage can be null */
  const sortedCompliance = compliance.sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

  /* Sort support based on the order of compliance */
  const sortedSupport = support.sort((a, b) => {
    return (
      sortedCompliance.findIndex((x) => x.id === a.id) -
      sortedCompliance.findIndex((x) => x.id === b.id)
    );
  });

  return { sortedCompliance, sortedSupport };
}

export function useFormatAndSortBehavior(
  behavior: BehaviorValue
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  const compliance = useFormatBehaviorType(behavior, 'compliance');
  const support = useFormatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}
