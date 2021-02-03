import css from '@styled-system/css';
import * as React from 'react';
import styled from 'styled-components';

export type LegendShape = 'line' | 'square';

export type LegendItem = { color: string; label: string; shape: LegendShape };
interface LegendProps {
  items: LegendItem[];
}

export function Legenda({ items }: LegendProps) {
  return (
    <List>
      {items.map(({ label, color, shape = 'line' }, i) => (
        <Item key={i}>
          {label}
          {shape === 'square' && <Square color={color} />}
          {shape === 'line' && <Line color={color} />}
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
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
