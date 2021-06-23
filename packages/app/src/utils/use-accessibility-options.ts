import { assert } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';

export interface AccessibilityOptions {
  key: string;
  features?: AccesssibilityFeature[];
}

type AccesssibilityFeature =
  | 'keyboard_time_series_chart'
  | 'keyboard_bar_chart'
  | 'keyboard_choropleth';

/**
 * Provides accessibility labels and description for interactive elements.
 * The label and description are retrieved from Lokalize and
 * more generic descriptions of interactive features are added to them.
 */

export function useAccessibilityOptions(options: AccessibilityOptions) {
  const { siteText } = useIntl();

  const { label, description: chartDescription } =
    siteText.accessibility.charts[
      options.key as keyof typeof siteText.accessibility.charts
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
    chartDescription.length > 10 || options.features?.length,
    `An accessibility description or interaction features need to be provided for ${options.key}`
  );

  const description = [chartDescription];

  if (isDefined(options.features)) {
    description.push(
      ...options.features.map(
        (feature) =>
          siteText.accessibility.features[
            feature as keyof typeof siteText.accessibility.features
          ]
      )
    );
  }

  return {
    label,
    description: description.filter(isDefined).join(' '),
    describedById: `${options.key}_id`,
  };
}

export function addAccessibilityFeatures(
  options: AccessibilityOptions,
  additionalFeatures: AccesssibilityFeature[]
): AccessibilityOptions {
  return {
    ...options,
    features: [...(options.features ?? []), ...additionalFeatures],
  };
}
