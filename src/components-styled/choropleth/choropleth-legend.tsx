import styled from 'styled-components';
import { Theme } from '~/style/theme';
import { Box } from '../base';

export const ChoroplethLegend = styled(Box)`
  grid-area: b;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }: { theme: Theme }) => theme.mediaQueries.lg} {
    align-items: flex-start;
  }
`;
