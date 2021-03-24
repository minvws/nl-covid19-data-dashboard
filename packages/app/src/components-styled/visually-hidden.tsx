/**
 * This component can be used to relay content that is visually hidden,
 * and can be used to provide context or labels to screen readers.
 */

import css from '@styled-system/css';
import { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <div
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
    </div>
  );
}
