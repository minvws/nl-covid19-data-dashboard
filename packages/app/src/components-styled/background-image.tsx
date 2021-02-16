import styled from 'styled-components';
import {
  backgroundImage,
  BackgroundImageProps,
  backgroundPosition,
  BackgroundPositionProps,
  backgroundRepeat,
  BackgroundRepeatProps,
  backgroundSize,
  BackgroundSizeProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
} from 'styled-system';
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';

export type BackgroundImageLocalProps = BackgroundImageProps &
  BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps &
  PositionProps;

export const BackgroundImage = styled.div.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundImage,
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout,
  position
);
