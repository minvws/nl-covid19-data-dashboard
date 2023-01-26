import { colors } from '@corona-dashboard/common';
import { fontWeights, space } from '~/style/theme';
import styled from 'styled-components';

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

interface HeaderCellProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export const HeaderCell = styled.th<HeaderCellProps>`
  border-bottom: 1px solid ${colors.gray2};
  font-size: ${space[3]};
  font-weight: ${fontWeights.bold};
  padding-bottom: ${space[2]};
  text-align: left;
  vertical-align: top;
  width: ${({ isFirst, isLast }) => (isFirst ? '30%' : isLast ? '25%' : undefined)};
`;

interface CellProps {
  alignRight?: boolean;
  border?: boolean;
  hasPaddingRight?: boolean;
  mobile?: boolean;
  narrow?: boolean;
}

export const Cell = styled.td<CellProps>`
  border-bottom: ${({ border, mobile }) => (border || !mobile ? `1px solid ${colors.gray2}` : undefined)};
  float: ${({ alignRight }) => (alignRight ? 'right' : undefined)};
  max-width: ${({ narrow }) => (narrow ? space[4] : undefined)};
  padding: ${({ hasPaddingRight }) => (hasPaddingRight ? `${space[3]} ${space[3]} ${space[3]} 0` : `${space[3]} 0`)};
  vertical-align: top;
`;
