import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { VisuallyHidden } from './visually-hidden';

interface IconButtonrops {
  children: ReactNode;
  size: number;
  title: string;
  color?: string;
  onClick?: (evt: React.MouseEvent) => void;
}

export function IconButton({
  children,
  size,
  title,
  color = 'currentColor',
  onClick,
}: IconButtonrops) {
  return (
    <StyledIconButton
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
