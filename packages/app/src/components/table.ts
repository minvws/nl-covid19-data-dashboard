import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  margin,
  padding,
  position,
  PositionProps,
  space,
  verticalAlign,
  VerticalAlignProps,
  width,
  WidthProps,
} from 'styled-system';
import { styledShouldForwardProp } from '~/lib/styled-should-forward-prop';

type TableProps = TableCellProps & PositionProps;

type TableCellProps = WidthProps & ColorProps & BorderProps & VerticalAlignProps;

export const Table = styled.table.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TableProps>({ borderCollapse: 'collapse', borderSpacing: 0, tableLayout: 'fixed' }, compose(margin, padding, color, space, position));

export const Row = styled.tr.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<ColorProps>(compose(color));

export const Cell = styled.td.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TableCellProps>(compose(margin, padding, color, space, border, verticalAlign, width));
