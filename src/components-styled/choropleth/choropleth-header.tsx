import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '../base';

export const ChoroplethHeader = styled(Box)(
  css({
    gridArea: 'a',
    mb: [0, 2],
  } as any) as any
);
// { md: 2, sm: 0 }
