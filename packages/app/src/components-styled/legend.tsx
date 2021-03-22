import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

export type LegendShape = 'line' | 'square' | 'circle';

export type LegendItem = {
  label: string;
} & (
  | { shape: LegendShape; color: string }
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
            {item.shape === 'line' && <Line color={item.color} />}
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
    display: 'block',
    position: 'absolute',
    left: 0,
    top: '3px',
  })
);

const Shape = styled.div<{ color: string }>((x) =>
  css({
    content: '',
    display: 'block',
    position: 'absolute',
    left: 0,
    backgroundColor: x.color,
  })
);

const Line = styled(Shape)(
  css({
    top: '10px',
    width: '15px',
    height: '3px',
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
