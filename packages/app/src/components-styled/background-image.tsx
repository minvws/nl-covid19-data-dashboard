import { maybeTransformImageUrlToWebp } from '~/lib/sanity';
import styled, { css } from 'styled-components';
import {
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

export type BackgroundImageLocalProps = {
  backgroundImageUrl: string;
  backgroundImagePrefix?: string;
  backgroundImageSuffix?: string;
} & BackgroundPositionProps &
  BackgroundSizeProps &
  BackgroundRepeatProps &
  LayoutProps &
  PositionProps;

export const BackgroundImage = styled.div.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<BackgroundImageLocalProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  backgroundPosition,
  backgroundSize,
  backgroundRepeat,
  layout,
  position,
  (x) => {
    const webpUrl = maybeTransformImageUrlToWebp(x.backgroundImageUrl);
    const prefix = x.backgroundImagePrefix ? `${x.backgroundImagePrefix},` : '';
    const suffix = x.backgroundImageSuffix ? `,${x.backgroundImageSuffix}` : '';

    return css`
      background-image: url('${x.backgroundImageUrl}');

      @supports (
        background-image: ${prefix} url('${x.backgroundImageUrl}') ${suffix}
      ) {
        background-image: ${prefix} url('${x.backgroundImageUrl}') ${suffix};
      }

      ${webpUrl &&
      css`
        /* Chrome 66+, Edge 79+, Opera 53+, Android Brower 80+ */
        @media screen and (min-resolution: 0.001dpcm) and (-webkit-min-device-pixel-ratio: 0) {
          @supports (
            background-image: ${prefix} -webkit-image-set(url('${webpUrl}') 1x) ${suffix}
          ) {
            background-image: ${prefix} -webkit-image-set(url('${webpUrl}') 1x) ${suffix};
          }
        }

        /* FF 66+ -- note the double parentheses are necessary (styled components bug?) */
        @supports ((flex-basis: max-content)) and ((-moz-appearance: meterbar)) {
          background-image: ${prefix} url('${webpUrl}') ${suffix};
        }
      `}
    `;
  }
);
