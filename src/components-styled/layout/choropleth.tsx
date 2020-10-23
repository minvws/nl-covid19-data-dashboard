import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '../base';

export const ChoroplethChart = styled(Box)(
  css({
    gridArea: 'c',
  })
);

export const ChoroplethHeader = styled(Box)(
  css({
    gridArea: 'a',
    mb: [0, 2],
  })
);

export const ChoroplethLegend = styled(Box)(
  css({
    gridArea: 'b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: ['center', 'center', 'center', 'flex-start'],
  })
);

export const ChoroplethSection = styled(Box)(
  css({
    bg: 'white',
    padding: 4,
    borderRadius: 5,
    boxShadow: 'tile',
    mb: 4,
    ml: [-4, -4, 0],
    mr: [-4, -4, 0],
    display: [null, null, null, 'grid'],
    gridTemplateColumns: [null, null, null, '1fr 1fr'],
    gridTemplateRows: [null, null, null, 'auto auto 1fr auto'],
    gridTemplateAreas: [null, null, null, `'w w' 'a c' 'b c' 'd c'`],
  })
);
