import css from '@styled-system/css';
import { cloneElement, forwardRef, ReactElement } from 'react';
import styled from 'styled-components';
import { VisuallyHidden } from './visually-hidden';

interface IconButtonProps {
  children: ReactElement;
  size: number;
  title: string;
  color?: string;
  onClick?: (evt: React.MouseEvent) => void;
  padding?: number | string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      size,
      title,
      color = 'currentColor',
      onClick,
      padding,
      ...ariaProps
    },
    ref
  ) => {
    return (
      <StyledIconButton
        ref={ref}
        title={title}
        type="button"
        onClick={onClick}
        size={size}
        color={color}
        padding={padding}
        {...ariaProps}
      >
        <VisuallyHidden>{title}</VisuallyHidden>
        {cloneElement(children, { 'aria-hidden': "true" })}
      </StyledIconButton>
    );
  }
);

const StyledIconButton = styled.button<{
  color: string;
  size: number;
  padding?: number | string;
}>((x) =>
  css({
    p: x.padding ?? 0,
    m: 0,
    bg: 'transparent',
    border: 'none',
    display: 'block',
    cursor: 'pointer',
    color: x.color,
    '& svg': {
      display: 'block',
      width: x.size,
      height: x.size,
    },
  })
);
