import { Box } from './base';
import styled from 'styled-components';
import { css } from '@styled-system/css';

export interface ILegendaItem {
  color: string;
  label: string;
}

export type TProps = {
  title: string;
  items: ILegendaItem[];
};

const Ul = styled.ul(
  css({
    marginTop: 0,
    paddingLeft: 0,
    listStyle: 'none',
    display: 'inline-flex',
    flexDirection: 'row',
  })
);

const Li = styled.li(
  css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: [0, null, 1],
  })
);

const LegendaItemBox = styled(Box)(
  css({
    width: ['50px', null, '60px'],
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    borderBottom: '1px solid lightgrey',
    borderTop: '1px solid lightgrey',
  })
);

export function ChoroplethLegenda(props: TProps) {
  const { items, title } = props;

  return (
    <Box>
      <h4>{title}</h4>
      <Ul aria-label="legend">
        {items.map((item, index) => (
          <Li key={item.color}>
            <LegendaItemBox
              borderLeft={index === 0 ? '1px solid lightgrey' : null}
              borderRight={
                index === items.length - 1 ? '1px solid lightgrey' : null
              }
              backgroundColor={item.color}
            />
            <div>{item.label}</div>
          </Li>
        ))}
      </Ul>
    </Box>
  );
}
