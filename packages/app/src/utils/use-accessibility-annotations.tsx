import { assert } from '@corona-dashboard/common';
import { isDefined, isPresent } from 'ts-is-present';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import type { SiteText } from '~/locale';

export interface AccessibilityDefinition {
  key: keyof SiteText['common']['accessibility']['charts'];
  features?: AccessibilityFeature[];
}

type AccessibilityFeature =
  | 'keyboard_time_series_chart'
  | 'keyboard_bar_chart'
  | 'keyboard_choropleth';

export type AccessibilityAnnotations = ReturnType<
  typeof useAccessibilityAnnotations
>;

/**
 * Provides accessibility labels and description for interactive elements.
 * The label and description are retrieved from Lokalize and
 * more generic descriptions of interactive features are added to them.
 *
 * @param definition - An object with the key of the accessibility label/description
 * in the site text, and optional accessibility features used.
 * @returns A visually hidden element containing the description, and the props
 * that should be added to the interactive element
 */
export function useAccessibilityAnnotations(
  definition: AccessibilityDefinition
) {
  const { commonTexts } = useIntl();

  const { label, description: chartDescription } =
    commonTexts.accessibility.charts[
      definition.key as keyof typeof commonTexts.accessibility.charts
    ];

  /**
   * There needs to be a label
   */
  assert(
    label,
    `[${useAccessibilityAnnotations.name}] An accessibility label needs to be provided for ${definition.key}`
  );

  /**
   * There needs to be a description, either constructed by a Lokalize text
   * or by providing interactive features
   */
  assert(
    isDefined(chartDescription) || definition.features?.length,
    `[${useAccessibilityAnnotations.name}] An accessibility description or interaction features need to be provided for ${definition.key}`
  );

  const description = [chartDescription].filter(isPresent);

  if (isDefined(definition.features)) {
    description.push(
      ...definition.features.map(
        (feature) =>
          commonTexts.accessibility.features[
            feature as keyof typeof commonTexts.accessibility.features
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
