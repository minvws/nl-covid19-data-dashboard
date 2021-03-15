/**
 * The default tooltip `TooltipSeriesList` can now display the full contents of
 * the series config with colors and all, instead of a single default item.
 */
import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Heading } from '~/components-styled/typography';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useViewport } from '~/utils/use-viewport';
import { Bounds, Padding } from '../../logic';
import { TooltipSeriesList } from './tooltip-series-list';
import { TooltipData, TooltipFormatter } from './types';

interface TooltipProps<T extends TimestampedValue> {
  title: string;
  data: TooltipData<T>;
  left: number;
  top: number;
  bounds: Bounds;
  padding: Padding;
  formatTooltip?: TooltipFormatter<T>;
}

/**
 * The Tooltip will always be rendered inside the viewport. Calculations
 * are quite messy and need to be cleaned up / refactored, but it does the
 * trick for now.
 *
 * @TODO clean up calculations in Tooltip component
 */
export function Tooltip<T extends TimestampedValue>({
  title,
  data: tooltipData,
  left: pointX,
  top: pointY,
  formatTooltip,
  bounds,
  padding,
}: TooltipProps<T>) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 60 });
  const { width = 0, height = 0, ref } = useResizeObserver<HTMLDivElement>();
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  const centeredLeft = pointX + padding.left - width / 2;
  const top = pointY - height - 20;

  const maxWidth = Math.min(
    bounds.width + padding.left + padding.right,
    viewportSize.width - 20
  );

  const offsetLeft = boundingBox?.left ?? 0;

  const minLeft = -offsetLeft + 10;
  const maxLeft = viewportSize.width - width - offsetLeft - 10;

  const left = Math.max(minLeft, Math.min(centeredLeft, maxLeft));

  return (
    <>
      <div ref={boundingBoxRef} />
      <TooltipContainer
        ref={ref}
        style={{
          opacity: isMounted ? 1 : 0,
          transform: `translate(${Math.round(left)}px,${Math.round(top)}px)`,
          transition: `transform ${isMounted ? '75ms' : '0ms'} ease-out`,
          maxWidth,
        }}
      >
        <TooltipContent title={title}>
          {typeof formatTooltip === 'function' ? (
            formatTooltip(tooltipData)
          ) : (
            <TooltipSeriesList data={tooltipData} />
          )}
        </TooltipContent>
      </TooltipContainer>
      <Triangle left={pointX + padding.left} top={pointY} />
    </>
  );
}

function Triangle({ left, top }: { left: number; top: number }) {
  return (
    <div
      css={css({
        position: 'absolute',
        left: 0,
        top: 0,
        transition: `transform 75ms ease-out`,
        zIndex: 1010,
        pointerEvents: 'none',
      })}
      style={{ transform: `translate(${left}px, ${top - 22}px)` }}
    >
      <StyledTriangle />
    </div>
  );
}

const StyledTriangle = styled.div(
  css({
    position: 'absolute',
    width: 0,
    height: 0,
    marginLeft: '-11px', // no idea why this should be 11px, but it works.
    boxSizing: 'border-box',
    border: '8px solid black',
    borderColor: 'transparent transparent #fff #fff',
    transformOrigin: '0 0',
    transform: 'rotate(-45deg)',
    boxShadow: '-3px 3px 3px 0 rgba(0, 0, 0, 0.05)',
  })
);

const TooltipContainer = styled.div(
  css({
    position: 'absolute',
    bg: 'white',
    boxShadow: 'tooltip',
    pointerEvents: 'none',
    zIndex: 1000,
    borderRadius: 1,
    top: 0,
    willChange: 'transform',
  })
);

interface IProps {
  title: string;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, onSelect, children } = props;

  return (
    <StyledTooltipContent onClick={onSelect}>
      <TooltipHeading title={title} />
      {children && (
        <div
          css={css({
            borderTop: '1px solid',
            borderTopColor: 'border',
            py: 2,
            px: 3,
          })}
        >
          {children}
        </div>
      )}
    </StyledTooltipContent>
  );
}

function TooltipHeading({ title }: { title: string }) {
  return (
    <div
      css={css({
        whiteSpace: 'nowrap',
        color: 'body',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      })}
    >
      <Heading
        level={3}
        m={0}
        fontSize={1}
        css={css({ overflow: 'hidden', textOverflow: 'ellipsis' })}
      >
        {title}
      </Heading>
    </div>
  );
}

const StyledTooltipContent = styled.div((x) =>
  css({
    color: 'body',
    width: '100%',
    minWidth: 250,
    borderRadius: 1,
    cursor: x.onClick ? 'pointer' : 'default',
    fontSize: 1,
  })
);
