/**
 * This component can be used to relay content that is visually hidden,
 * and can be used to provide context or labels to screen readers.
 */

import css from '@styled-system/css';
import { ComponentProps, ReactNode } from 'react';
import styled from 'styled-components';

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: ComponentProps<typeof StyledVisuallyHidden>['as'];
}

export function VisuallyHidden({ children, as }: VisuallyHiddenProps) {
  return <StyledVisuallyHidden as={as}>{children}</StyledVisuallyHidden>;
}

const StyledVisuallyHidden = styled.div(
  css({
    position: 'absolute',
    overflow: 'hidden',
    width: '1px',
    height: '1px',
    padding: 0,
    border: 0,
    margin: -1,
    clip: 'rect(0, 0, 0, 0)',
  })
);
