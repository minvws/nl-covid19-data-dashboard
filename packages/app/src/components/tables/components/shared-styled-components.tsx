import { Anchor } from '~/components/typography';
import { colors } from '@corona-dashboard/common';
import { DisplayProps, compose, display, WidthProps, width, MinWidthProps, BorderProps, minWidth, border } from 'styled-system';
import { fontWeights, space } from '~/style/theme';
import styled from 'styled-components';

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

type RowProps = DisplayProps;

export const Row = styled.tr<RowProps>`
  flex-wrap: wrap;
  justify-content: space-between;
  ${compose(display)};
`;

type HeaderCellProps = WidthProps & DisplayProps;

export const HeaderCell = styled.th<HeaderCellProps>`
  border-bottom: 1px solid ${colors.gray2};
  font-weight: ${fontWeights.bold};
  padding-bottom: ${space[2]};
  text-align: left;
  vertical-align: middle;
  ${compose(width)};
  ${compose(display)};
`;

type CellProps = MinWidthProps & BorderProps;

export const Cell = styled.td<CellProps>`
  border-bottom: 1px solid ${colors.gray2};
  padding: ${space[3]} ${space[0]};
  vertical-align: middle;
  ${compose(minWidth)};
  ${compose(border)};
`;

export const BehaviorAnchor = styled(Anchor)`
  &:hover {
    color: ${colors.blue8};
  }
`;
