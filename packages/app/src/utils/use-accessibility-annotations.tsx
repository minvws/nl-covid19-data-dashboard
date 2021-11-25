import { assert } from '@corona-dashboard/common';
import { isDefined, isPresent } from 'ts-is-present';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import type { SiteText } from '~/locale';

export interface AccessibilityDefinition {
  key: keyof SiteText['accessibility']['charts'];
  features?: AccessibilityFeature[];
}

type AccessibilityFeature =
  | 'keyboard_time_series_chart'
  | 'keyboard_bar_chart'
  | 'keyboard_choropleth';

/**
 * Provides accessibility labels and description for interactive elements.
 * The label and description are retrieved from Lokalize and
 * more generic descriptions of interactive features are added to them.
 */

export type AccessibilityAnnotations = ReturnType<
  typeof useAccessibilityAnnotations
>;

export function useAccessibilityAnnotations(
  definition: AccessibilityDefinition
) {
  const { siteText } = useIntl();

  const { label, description: chartDescription } =
    siteText.accessibility.charts[
      definition.key as keyof typeof siteText.accessibility.charts
    ];

  /**
   * @todo Make label content mandatory once enough content is filled.
   *
   * assert(
   *  label,
   *  `An accessibility label needs to be provided for ${options.key}`
   * );
   */

  /**
   * There needs to be a description, either constructed by a Lokalize text
   * or by providing interactive features
   */
  assert(
    isDefined(chartDescription) || definition.features?.length,
    `An accessibility description or interaction features need to be provided for ${definition.key}`
  );

  const description = [chartDescription].filter(isPresent);

  if (isDefined(definition.features)) {
    description.push(
      ...definition.features.map(
        (feature) =>
          siteText.accessibility.features[
            feature as keyof typeof siteText.accessibility.features
          ]
      )
    );
  }

  const describedById = `${definition.key}_id`;

  return {
    descriptionElement: (
      <VisuallyHidden id={describedById}>
        {description.filter(isDefined).join(' ')}
      </VisuallyHidden>
    ),
    props: {
      'aria-label': label,
      'aria-describedby': describedById,
    },
  };
}

export function addAccessibilityFeatures(
  options: AccessibilityDefinition,
  additionalFeatures: AccessibilityFeature[]
): AccessibilityDefinition {
  return {
    ...options,
    features: [...(options.features ?? []), ...additionalFeatures],
  };
}
