import { css } from '@styled-system/css';
import styled from 'styled-components';
import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { Box } from './base';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
}

export function ChoroplethLegenda({
  title,
  thresholds,
}: ChoroplethLegendaProps) {
  return (
    <Box width="100%" maxWidth={300}>
      {title && <h4>{title}</h4>}
      <List aria-label="legend">
        {thresholds.map(({ color, threshold }, index) => (
          <Item key={color + threshold}>
            <LegendaColor
              color={color}
              first={index === 0}
              last={index === thresholds.length - 1}
            />
            <Label>{threshold}</Label>
          </Item>
        ))}
      </List>
    </Box>
  );
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
    fontSize: [0, null, 1],
  })
);

const LegendaColor = styled.div<{
  first: boolean;
  last: boolean;
  color: string;
}>((x) =>
  css({
    width: '100%',
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: x.first ? '2px 0 0 2px' : x.last ? '0 2px 2px 0' : 0,
    backgroundColor: x.color,
  })
);

const Label = styled.span(
  css({
    py: 1,
    display: 'inline-block',
    transform: 'translateX(-50%)',
  })
);
