import { ReactNode } from 'react';
import { Text } from '~/components/typography';

/**
 * A basic component for showing a gray annotation next to a chart or kpi value
 */
export function ValueAnnotation({
  children,
  mb,
}: {
  children: ReactNode;
  mb?: number;
}) {
  return (
    <Text as="div" color="annotation" m={0} mb={mb} fontSize="12px">
      {children}
    </Text>
  );
}
