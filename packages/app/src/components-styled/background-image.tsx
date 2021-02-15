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
import { StyledShouldForwardProp } from '~/utils/styledShouldForwardProp';

export type BackgroundImageLocalProps = BackgroundImageProps &
  BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps &
  PositionProps;

export const BackgroundImage = styled.div.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundImage,
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout,
  position
);
