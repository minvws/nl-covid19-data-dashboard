import { useIntl } from '~/intl';

export interface AccessibilityOptions {
  key: string;
  features?: AccesssibilityFeature[];
  variant?: string;
}

type AccesssibilityFeature =
  | 'keyboard_line_chart'
  | 'keyboard_line_bar_chart'
  | 'fullscreen';

export function useAccessibilityOptions(options: AccessibilityOptions) {
  const { siteText } = useIntl();
  const label = 'Ziekenhuisopnames van 27 februari 2020 tot en met 1 juni 2021';
  const description =
    'Navigeer met toetsenbord: pijltjes links en rechts, page up en page down om door naar een andere datum te gaan.';

  return {
    label,
    description,
    describedById: `${options.key}_id`,
  };
}
