import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { compose, padding, PaddingProps } from 'styled-system';
import { fontSizes, fontWeights, space } from '~/style/theme';

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

interface StyledHeaderCellProps {
  isMobile?: boolean;
}

export const StyledHeaderCell = styled.th<StyledHeaderCellProps>`
  font-size: ${fontSizes[1]};
  font-weight: ${fontWeights.bold};
  padding: ${({ isMobile }) => (isMobile ? space[3] : space[2])} ${space[3]};
  text-align: left;
  vertical-align: top;
  width: ${({ isMobile }) => (!isMobile ? '33%' : undefined)};
`;

interface StyledCellProps extends PaddingProps {
  alignRight?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
}

export const StyledCell = styled.td<StyledCellProps>`
  float: ${({ alignRight }) => (alignRight ? 'right' : undefined)};
  padding: ${({ isMobile }) => (isMobile ? space[2] : space[4])} ${space[3]};
  vertical-align: top;
  width: ${({ isMobile }) => (!isMobile ? '33%' : undefined)};
  ${compose(padding)}
`;

interface StyledRowProps {
  isFirst: boolean;
}

const getBorderColor = (isFirst: boolean) => (isFirst ? colors.blue8 : colors.gray2);

export const StyledRow = styled.tr<StyledRowProps>`
  background: ${({ isFirst }) => (isFirst ? colors.primaryOpacity : undefined)};
  border-top: 1px solid ${({ isFirst }) => getBorderColor(isFirst)};
  border-bottom: 1px solid ${({ isFirst }) => getBorderColor(isFirst)};
  cursor: pointer;
`;
