import css, { SystemStyleObject } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

export type LegendShape = 'line' | 'square' | 'circle';
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
}

export function Legend({ items }: LegendProps) {
  return (
    <List>
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

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
    fontSize: 1,
    color: 'annotation',
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

const Square = styled(Shape)(
  css({
    top: '5px',
    width: '15px',
    height: '15px',
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
