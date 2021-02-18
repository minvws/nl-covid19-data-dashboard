import styled from 'styled-components';
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
import { maybeCreateWebpUrl } from '~/lib/sanity';
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
    const webpUrl = maybeCreateWebpUrl(x.backgroundImageUrl);
    const prefix = x.backgroundImagePrefix ? `${x.backgroundImagePrefix},` : '';
    const suffix = x.backgroundImageSuffix ? `,${x.backgroundImageSuffix}` : '';

    return {
      backgroundImage: `${prefix} url('${x.backgroundImageUrl}') ${suffix}`,

      ...(webpUrl && {
        '.has-webp-support &&': {
          backgroundImage: `${prefix} url('${webpUrl}') ${suffix}`,
        },
      }),
    };
  }
);
