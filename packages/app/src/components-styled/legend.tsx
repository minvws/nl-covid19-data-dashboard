import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';

export type LegendShape = 'line' | 'square' | 'circle' | 'custom';

export type LegendItem = {
  color: string;
  label: string;
  shape: LegendShape;
  shapeComponent?: ReactNode;
};
interface LegendProps {
  items: LegendItem[];
}

export function Legend({ items }: LegendProps) {
  return (
    <List>
      {items.map((item, i) => {
        const { label, color, shape, shapeComponent } = item;
        return (
          <Item key={i}>
            {label}
            {shape === 'square' && <Square color={color} />}
            {shape === 'line' && <Line color={color} />}
            {shape === 'circle' && <Circle color={color} />}
            {shape === 'custom' && shapeComponent && (
              <CustomShape>{shapeComponent}</CustomShape>
            )}
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
