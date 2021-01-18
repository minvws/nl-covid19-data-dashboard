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
} from 'styled-system';

export type BackgroundImageLocalProps = BackgroundImageProps &
  BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps;

export const BackgroundImage = styled.div<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundImage,
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout
);
