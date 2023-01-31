import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { border, BorderProps, compose, display, DisplayProps, minWidth, MinWidthProps, width, WidthProps } from 'styled-system';
import { fontWeights, mediaQueries, space } from '~/style/theme';

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid ${colors.gray2};
`;

type RowProps = DisplayProps;

export const Row = styled.tr<RowProps>`
  flex-wrap: wrap;
  justify-content: space-between;
  ${compose(display)};
`;

type HeaderCellProps = WidthProps & DisplayProps & MinWidthProps;

export const HeaderCell = styled.th<HeaderCellProps>`
  border-bottom: 1px solid ${colors.gray2};
  font-weight: ${fontWeights.bold};
  padding-bottom: ${space[2]};
  text-align: left;
  vertical-align: middle;
  ${compose(display, width, minWidth)};

  @media ${mediaQueries.lg} {
    padding-right: ${space[2]};
  }
`;

type CellProps = MinWidthProps & BorderProps;

export const Cell = styled.td<CellProps>`
  border-bottom: 1px solid ${colors.gray2};
  padding-block: ${space[3]};
  vertical-align: middle;
  ${compose(border, minWidth)};
`;
