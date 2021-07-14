import styled from 'styled-components';
import {
  ColorProps,
  compose,
  SpaceProps,
  TypographyProps,
  color,
  space,
  typography,
} from 'styled-system';

type SpanProps = SpaceProps & ColorProps & TypographyProps;

export const Span = styled.span<SpanProps>(compose(color, space, typography));
