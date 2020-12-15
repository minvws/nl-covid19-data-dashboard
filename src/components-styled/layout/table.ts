import styled from 'styled-components';
import {
  compose,
  margin,
  padding,
  color,
  space,
  position,
  border,
  verticalAlign,
  VerticalAlignProps,
  SpaceProps,
  BorderProps,
  LayoutProps,
  ColorProps,
  PositionProps,
} from 'styled-system';

type TableProps = TableCellProps & PositionProps;

type TableCellProps = TableBodyProps &
  ColorProps &
  BorderProps &
  VerticalAlignProps;

type TableBodyProps = SpaceProps & LayoutProps;

export const Table = styled.table<TableProps>(
  { borderCollapse: 'collapse', borderSpacing: 0 },
  compose(margin, padding, color, space, position)
);

export const TableBody = styled.tbody<TableBodyProps>(
  compose(margin, padding, space)
);

export const Row = styled.tr<ColorProps>(compose(color));

export const Cell = styled.td<TableCellProps>(
  compose(margin, padding, color, space, border, verticalAlign)
);
