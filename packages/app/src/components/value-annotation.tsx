import { ReactNode } from 'react';
import { Text } from '~/components/typography';

/**
 * A basic component for showing a gray annotation next to a chart or kpi value
 */
export function ValueAnnotation({ children }: { children: ReactNode }) {
  return (
    <Text as="div" color="gray7" variant="label2" aria-hidden={true}>
      {children}
    </Text>
  );
}
