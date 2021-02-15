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
import shouldForwardProp from '@styled-system/should-forward-prop';

export type BackgroundImageLocalProps = BackgroundImageProps &
  BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps &
  PositionProps;

export const BackgroundImage = styled.div.withConfig({
  shouldForwardProp: shouldForwardProp as any,
})<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundImage,
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout,
  position
);
