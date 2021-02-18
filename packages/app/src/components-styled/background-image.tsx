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
      /* Default background image */
      background-image: url('${x.backgroundImageUrl}');

      /* apply prefix and/or suffix, but only if browser has support for it */
      @supports (
        background-image: ${prefix} url('${x.backgroundImageUrl}') ${suffix}
      ) {
        background-image: ${prefix} url('${x.backgroundImageUrl}') ${suffix};
      }

      ${webpUrl &&
      css`
        .has-webp-support && {
          background-image: ${prefix} url('${webpUrl}') ${suffix};
        }
      `}
    `;
  }
);
