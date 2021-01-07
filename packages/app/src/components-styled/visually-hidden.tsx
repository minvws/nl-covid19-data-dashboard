/**
 * This component can be used to relay text that is visually hidden,
 * and can be used to provide context or labels to screen readers.
 */

import css from '@styled-system/css';
import { ReactNode } from 'react';
import { Text } from './typography';

interface VisuallyHiddenProps {
  children: ReactNode;
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <Text
      css={css({
        position: 'absolute',
        overflow: 'hidden',
        width: '1px',
        height: '1px',
        padding: 0,
        border: 0,
        margin: -1,
        clip: 'rect(0, 0, 0, 0)',
      })}
    >
      {children}
    </Text>
  );
}
