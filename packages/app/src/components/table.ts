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
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';

type TableProps = TableCellProps & PositionProps;

type TableCellProps = TableBodyProps &
  WidthProps &
  ColorProps &
  BorderProps &
  VerticalAlignProps;

type TableBodyProps = SpaceProps & LayoutProps;

export const Table = styled.table.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TableProps>(
  { borderCollapse: 'collapse', borderSpacing: 0, tableLayout: 'fixed' },
  compose(margin, padding, color, space, position)
);

export const TableBody = styled.tbody.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TableBodyProps>(compose(margin, padding, space));

export const Row = styled.tr.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<ColorProps>(compose(color));

export const Cell = styled.td.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TableCellProps>(
  compose(margin, padding, color, space, border, verticalAlign, width)
);
