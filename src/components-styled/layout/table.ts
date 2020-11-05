import styled from 'styled-components';
import {
  compose,
  margin,
  padding,
  color,
  space,
  SpaceProps,
  LayoutProps,
  ColorProps,
  PositionProps,
} from 'styled-system';

type TableProps = SpaceProps & LayoutProps & ColorProps & PositionProps;

export const Table = styled.table<TableProps>(
  compose(margin, padding, color, space)
);

export const Tr = styled.tr<TableProps>(compose(margin, padding, color, space));

export const Td = styled.td<TableProps>(compose(margin, padding, color, space));
