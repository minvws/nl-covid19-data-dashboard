import { cloneElement, forwardRef, ReactElement } from 'react';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { VisuallyHidden } from './visually-hidden';

interface IconButtonProps {
  children: ReactElement;
  size: number;
  title: string;
  color?: string;
  onClick?: (evt: React.MouseEvent) => void;
  padding?: number | string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ children, size, title, color = 'currentColor', onClick, padding, ...ariaProps }, ref) => {
  return (
    <StyledIconButton ref={ref} title={title} type="button" onClick={onClick} size={size} color={color} padding={padding} {...ariaProps}>
      <VisuallyHidden>{title}</VisuallyHidden>
      {cloneElement(children, { 'aria-hidden': 'true' })}
    </StyledIconButton>
  );
});

interface StyledIconButtonProps {
  color: string;
  size: number;
  padding?: number | string;
}

const StyledIconButton = styled.button<StyledIconButtonProps>`
  background: transparent;
  border: none;
  color: ${({ color }) => color};
  cursor: pointer;
  display: block;
  margin: ${space[0]};
  padding: ${({ padding }) => (padding ? `${padding}px` : space[0])};

  & svg {
    display: block;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
  }
`;
