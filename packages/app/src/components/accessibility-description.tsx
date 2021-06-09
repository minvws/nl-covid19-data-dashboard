import { ReactNode, useMemo } from 'react';
import { isDefined } from 'ts-is-present';

export interface AccessibilityOptions {
  key: string;
  features?: AccesssibilityFeature[];
}

type AccesssibilityFeature =
  | 'keyboard_line_chart'
  | 'keyboard_line_bar_chart'
  | 'fullscreen';

export function AccessibilityDescription({
  options,
  children,
}: {
  options: AccessibilityOptions;
  children: ReactNode;
}) {
  const label = options.key;
  const constructedDescription = useMemo(function () {
    const parts = [];

    // if (isDefined(options.description)) {
    //   parts.push(options.description);
    // }
    if (isDefined(options.features)) {
      // TODO translate
      parts.push(...options.features);
    }
    return parts.join(' - ');
  }, []);
  return (
    <div
      role="figure"
      style={{ border: '1px solid red' }}
      aria-label={label}
      aria-description={constructedDescription}
    >
      {children}
    </div>
  );
}
