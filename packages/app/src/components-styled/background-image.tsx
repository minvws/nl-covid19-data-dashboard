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

export type BackgroundImageLocalProps = BackgroundImageProps &
  BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps &
  PositionProps;

export const BackgroundImage = styled.div<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundImage,
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout,
  position
);
