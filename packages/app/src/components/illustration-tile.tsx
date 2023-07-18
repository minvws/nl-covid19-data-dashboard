import { Tile } from '~/components/tile';
import { css } from '@styled-system/css';
import { space } from '~/style/theme';

interface IllustrationProps {
  image: string;
  alt: string;
  description: string;
  hasNoBorder?: boolean;
  hasNoPaddingBottom?: boolean;
}

/**
 * A image KPI tile which composes an image into the tile itself.
 */
export function IllustrationTile({ image, alt, description, hasNoBorder, hasNoPaddingBottom }: IllustrationProps) {
  return (
    <Tile hasNoBorder={hasNoBorder} hasNoPaddingBottom={hasNoPaddingBottom}>
      <img width="315px" height="100px" loading="lazy" src={image} alt={alt} css={css({ marginBottom: space[3] })} />
      <p>{description}</p>
    </Tile>
  );
}
