import css from '@styled-system/css';
import { FocusEvent, MouseEvent, useCallback } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

interface PathProps {
  pathData: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
  isClickable?: boolean;
  isSelected?: boolean;
}

export function Path({
  id,
  pathData,
  fill,
  stroke,
  strokeWidth,
  isClickable,
}: PathProps) {
  return (
    <StyledPath
      d={pathData}
      shapeRendering="optimizeQuality"
      data-id={id}
      isClickable={isClickable}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

interface HoverPathLinkProps extends PathProps {
  href?: string;
  title: string;
  isTabInteractive: boolean;
  onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
  onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
}

export function HoverPathLink({
  href,
  title,
  isTabInteractive,
  onFocus,
  onBlur,
  ...pathProps
}: HoverPathLinkProps) {
  const isTouch = useIsTouchDevice();
  const handleClick = useCallback(
    (evt: MouseEvent) => {
      /**
       * Prevent default click behavior when in touch mode, we'll
       * show a tooltip for the user to tap on.
       *
       * evt.detail equals 0 when a click is triggered using Enter/Return
       */
      if (isTouch && evt.detail !== 0) {
        evt.preventDefault();
      }
    },
    [isTouch]
  );

  return (
    <a
      href={href}
      aria-label={title}
      title={title}
      tabIndex={isTabInteractive ? 0 : -1}
      aria-hidden={isTabInteractive ? undefined : 'true'}
      data-id={pathProps.id}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      css={css({
        outline: isDefined(href) ? undefined : 'none !important',
        '&:focus': { outline: 'none' },
      })}
    >
      <HoverPath isClickable={isDefined(href)} {...pathProps} />
    </a>
  );
}

function HoverPath({
  id,
  pathData,
  fill,
  stroke,
  strokeWidth,
  isClickable,
  isSelected,
}: PathProps) {
  return (
    <StyledHoverPath
      d={pathData}
      shapeRendering="optimizeQuality"
      data-id={id}
      isClickable={isClickable}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      isSelected={isSelected}
      aria-hidden="true"
    />
  );
}

const StyledPath = styled.path<{
  isClickable?: boolean;
}>((x) =>
  css({
    fill: x.fill || 'transparent',
    stroke: x.stroke,
    strokeWidth: x.strokeWidth || 0.5,
    pointerEvents: 'none',
  })
);

const StyledHoverPath = styled.path<{
  isClickable?: boolean;
  isSelected?: boolean;
}>((x) =>
  css({
    fill: 'transparent',
    transitionProperty: 'fill, stroke, stroke-width',
    transitionDuration: '120ms, 90ms',
    transitionTimingFunction: 'ease-out',
    cursor: x.isClickable ? 'pointer' : 'default',
    stroke: x.stroke ? (x.isSelected ? '#000' : 'transparent') : 'transparent',
    strokeWidth: x.isSelected ? 3 : 0,
    pointerEvents: 'all',

    '&:hover, a:focus &': {
      transitionDuration: '0ms',
      fill: x.fill ?? 'none',
      stroke: x.stroke ?? '#fff',
      strokeWidth: x.strokeWidth ?? 3,
    },
  })
);
