import { css } from '@styled-system/css';
import styled from 'styled-components';
import { ChoroplethThresholdsValue } from '~/components/choropleth/shared';
import { Box } from './base';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
}

export function ChoroplethLegenda({
  title,
  thresholds,
}: ChoroplethLegendaProps) {
  const items = thresholds.map(
    (threshold: ChoroplethThresholdsValue, index: number) => {
      return {
        color: threshold.color,
        label: createLabel(thresholds, index),
      };
    }
  );

  return (
    <Box width="100%" maxWidth={400}>
      {title && <h4>{title}</h4>}
      <List aria-label="legend">
        {items.map((item) => (
          <Item key={item.color}>
            <LegendaItemBox backgroundColor={item.color} />
            <Box p={1}>{item.label}</Box>
          </Item>
        ))}
      </List>
    </Box>
  );
}

function createLabel(list: ChoroplethThresholdsValue[], index: number) {
  if (index === 0) {
    return `< ${list[1].threshold}`;
  }
  if (index === list.length - 1) {
    return `> ${list[index].threshold}`;
  }
  return `${list[index].threshold} - ${list[index + 1].threshold}`;
}

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
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    borderBottom: '1px solid lightgrey',
    borderTop: '1px solid lightgrey',
  })
);
