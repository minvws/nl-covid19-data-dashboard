import css from '@styled-system/css';
import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import { VisuallyHidden } from './visually-hidden';

interface IconButtonProps {
  children: ReactNode;
  size: number;
  title: string;
  color?: string;
  onClick?: (evt: React.MouseEvent) => void;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size, title, color = 'currentColor', onClick }, ref) => {
    return (
      <StyledIconButton
        ref={ref}
        title={title}
        type="button"
        onClick={onClick}
        size={size}
        color={color}
      >
        <VisuallyHidden>{title}</VisuallyHidden>
        {children}
      </StyledIconButton>
    );
  }
);

const StyledIconButton = styled.button<{ color: string; size: number }>((x) =>
  css({
    p: 0,
    m: 0,
    bg: 'transparent',
    border: 'none',
    display: 'block',
    cursor: 'pointer',
    color: x.color,
    '& > svg': {
      display: 'block',
      width: x.size,
      height: x.size,
    },
  })
);
