import { Tile } from '~/components/tile';
import { space } from '~/style/theme';
import { Box } from './base/box';

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
      <Box marginBottom={space[3]}>
        <img width="315px" height="100px" loading="lazy" src={image} alt={alt} />
      </Box>
      <p>{description}</p>
    </Tile>
  );
}
