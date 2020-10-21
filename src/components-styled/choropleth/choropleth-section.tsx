import styled from 'styled-components';
import theme from '~/style/theme';
import { Box } from '../base';

export const ChoroplethSection = styled(Box)`
  background-color: white;
  padding: 2em;
  border-radius: ${({ theme }) => `${theme.radii[1]}px`};
  box-shadow: ${({ theme }) => theme.shadows.tile};
  margin-bottom: ${({ theme }) => theme.space[4]};
  margin-left: -4;
  margin-right: -4;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: ${theme.space[0]};
    margin-right: ${theme.space[0]};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas: 'w w' 'a c' 'b c' 'd c';
  }
`;
