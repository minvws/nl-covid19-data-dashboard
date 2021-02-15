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
import shouldForwardProp from '@styled-system/should-forward-prop';

type TableProps = TableCellProps & PositionProps;

type TableCellProps = TableBodyProps &
  WidthProps &
  ColorProps &
  BorderProps &
  VerticalAlignProps;

type TableBodyProps = SpaceProps & LayoutProps;

export const Table = styled.table.withConfig({
  shouldForwardProp: shouldForwardProp as any,
})<TableProps>(
  { borderCollapse: 'collapse', borderSpacing: 0, tableLayout: 'fixed' },
  compose(margin, padding, color, space, position)
);

export const TableBody = styled.tbody.withConfig({
  shouldForwardProp: shouldForwardProp as any,
})<TableBodyProps>(compose(margin, padding, space));

export const Row = styled.tr.withConfig({
  shouldForwardProp: shouldForwardProp as any,
})<ColorProps>(compose(color));

export const Cell = styled.td.withConfig({
  shouldForwardProp: shouldForwardProp as any,
})<TableCellProps>(
  compose(margin, padding, color, space, border, verticalAlign, width)
);
