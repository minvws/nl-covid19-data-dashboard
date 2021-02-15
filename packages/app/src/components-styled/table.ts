import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  LayoutProps,
  margin,
  padding,
  position,
  PositionProps,
  space,
  SpaceProps,
  verticalAlign,
  VerticalAlignProps,
  width,
  WidthProps,
} from 'styled-system';
import { StyledShouldForwardProp } from '~/utils/styledShouldForwardProp';

type TableProps = TableCellProps & PositionProps;

type TableCellProps = TableBodyProps &
  WidthProps &
  ColorProps &
  BorderProps &
  VerticalAlignProps;

type TableBodyProps = SpaceProps & LayoutProps;

export const Table = styled.table.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<TableProps>(
  { borderCollapse: 'collapse', borderSpacing: 0, tableLayout: 'fixed' },
  compose(margin, padding, color, space, position)
);

export const TableBody = styled.tbody.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<TableBodyProps>(compose(margin, padding, space));

export const Row = styled.tr.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<ColorProps>(compose(color));

export const Cell = styled.td.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<TableCellProps>(
  compose(margin, padding, color, space, border, verticalAlign, width)
);
