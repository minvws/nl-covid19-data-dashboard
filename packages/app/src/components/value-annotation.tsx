import { ReactNode } from 'react';
import { Text } from '~/components/typography';

/**
 * A basic component for showing a gray annotation next to a chart or kpi value
 */
export function ValueAnnotation({ children }: { children: ReactNode }) {
  return (
    <Text as="div" color="annotation" variant="label2">
      {children}
    </Text>
  );
}
