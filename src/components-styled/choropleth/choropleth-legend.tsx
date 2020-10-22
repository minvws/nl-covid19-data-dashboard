import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '../base';

export const ChoroplethLegend = styled(Box)(
  css({
    gridArea: 'b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: ['center', 'center', 'center', 'flex-start'],
  })
);
