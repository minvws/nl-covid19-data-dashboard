import { Box } from './base';
import styled from 'styled-components';
import { css } from '@styled-system/css';

export interface LegendaItem {
  color: string;
  label: string;
}

export type ChoroplethLegendaProps = {
  title: string;
  items: LegendaItem[];
};

const List = styled.ul(
  css({
    width: '100%',
    marginTop: 0,
    paddingLeft: 0,
    listStyle: 'none',
    display: 'flex',
  })
);

const Item = styled.li(
  css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: [0, null, 1],
    '&:first-child div:first-child': {
      borderLeft: '1px solid lightgrey',
    },
    '&:last-child div:first-child': {
      borderRight: '1px solid lightgrey',
    },
  })
);

const LegendaItemBox = styled(Box)(
  css({
    width: '100%',
    maxWidth: 60,
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    borderBottom: '1px solid lightgrey',
    borderTop: '1px solid lightgrey',
  })
);

export function ChoroplethLegenda(props: ChoroplethLegendaProps) {
  const { items, title } = props;

  return (
    <Box width="100%" maxWidth={300}>
      <h4>{title}</h4>
      <List aria-label="legend">
        {items.map((item) => (
          <Item key={item.color}>
            <LegendaItemBox backgroundColor={item.color} />
            <div>{item.label}</div>
          </Item>
        ))}
      </List>
    </Box>
  );
}
