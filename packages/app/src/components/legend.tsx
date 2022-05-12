import { colors } from '@corona-dashboard/common';
import css, { SystemStyleObject } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

type LegendShape =
  | 'line'
  | 'square'
  | 'circle'
  | 'dotted-square'
  | 'outlined-square';
type LegendLineStyle = 'solid' | 'dashed';

export type LegendItem = {
  label: string;
} & (
  | {
      shape: LegendShape;
      color: string;
      style?: LegendLineStyle;
    }
  | { shape: 'custom'; shapeComponent: ReactNode }
);

interface LegendProps {
  items: LegendItem[];
  columns?: number;
}

export function Legend({ items, columns }: LegendProps) {
  return (
    <List columns={columns}>
      {items.map((item, i) => {
        if (item.shape === 'custom') {
          return (
            <Item key={i}>
              {item.label}
              <CustomShape>{item.shapeComponent}</CustomShape>
            </Item>
          );
        }

        return (
          <Item key={i}>
            {item.label}
            {item.shape === 'square' && <Square color={item.color} />}
            {item.shape === 'outlined-square' && (
              <OutlinedSquare color={item.color} />
            )}
            {item.shape === 'dotted-square' && (
              <DottedSquare color={item.color} />
            )}
            {item.shape === 'line' && (
              <Line color={item.color} lineStyle={item.style ?? 'solid'} />
            )}
            {item.shape === 'circle' && <Circle color={item.color} />}
          </Item>
        );
      })}
    </List>
  );
}

const List = styled.ul<{ columns?: number }>(({ columns }) =>
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
    fontSize: 1,
    color: 'annotation',
    columns,
    ...(columns === 1 && { display: 'flex', flexDirection: 'column' }),
  })
);

const Item = styled.li(
  css({
    my: 1,
    mr: 3,
    position: 'relative',
    display: 'inline-block',
    pl: '25px', // alignment with shape
  })
);

const CustomShape = styled.div(
  css({
    content: '',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: '3px',
    width: '15px',
    height: '15px',
  })
);

const Shape = styled.div<{ color: string }>((x) =>
  css({
    display: 'block',
    position: 'absolute',
    left: 0,
    backgroundColor: x.color,
  })
);

function DottedSquare({ color }: { color: string }) {
  return (
    <Shape color="white" css={css({ top: '3px' })}>
      <svg width={16} height={16} viewBox={`0 0 ${16} ${16}`}>
        <defs>
          <pattern
            id="dotted_legend"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="4"
              x2="0"
              y2="0"
              style={{ stroke: color, strokeWidth: 4, strokeDasharray: 2 }}
            />
          </pattern>
        </defs>
        <g>
          <rect
            x={0}
            y={0}
            fill={`url(#dotted_legend)`}
            width={16}
            height={16}
          />
        </g>
      </svg>
    </Shape>
  );
}

const OutlinedSquare = styled(Shape)(
  css({
    top: '3px',
    width: '15px',
    height: '15px',
    borderColor: colors.labelGray,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '2px',
  })
);

const Square = styled(Shape)(
  css({
    top: '3px',
    width: '15px',
    height: '15px',
    borderRadius: '2px',
  })
);

const Circle = styled(Shape)(
  css({
    top: '7.5px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  })
);

const Line = styled.div<{ color: string; lineStyle: LegendLineStyle }>(
  ({ color, lineStyle }) =>
    css({
      display: 'block',
      position: 'absolute',
      borderTopColor: color as SystemStyleObject,
      borderTopStyle: lineStyle,
      borderTopWidth: '3px',
      top: '10px',
      width: '15px',
      height: 0,
      borderRadius: '2px',
      left: 0,
    })
);
