import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { MaxWidth } from '~/components-styled/max-width';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';

import { Image as SrcSetImage } from '~/components-styled/image';

export function Image({ node }: { node: ImageBlock | RichContentImageBlock }) {
  const caption = 'caption' in node && node.caption && (
    <figcaption>{node.caption}</figcaption>
  );

  return 'isFullWidth' in node && node.isFullWidth ? (
    <Box bg="page">
      <MaxWidth py={4} px={4}>
        <Box as="figure" role="group" spacing={3}>
          <SrcSetImage
            src={`/${node.asset.assetId}.${node.asset.extension}`}
            width={node.asset.metadata.dimensions.width}
            height={node.asset.metadata.dimensions.height}
            alt={node.alt}
            borderRadius={1}
            boxShadow="tile"
          />

          {caption}
        </Box>
      </MaxWidth>
    </Box>
  ) : (
    <ContentBlock>
      <Box as="figure" role="group" spacing={3} textAlign="center">
        <SrcSetImage
          src={`/${node.asset.assetId}.${node.asset.extension}`}
          width={node.asset.metadata.dimensions.width}
          height={node.asset.metadata.dimensions.height}
          alt={node.alt}
        />
        {caption}
      </Box>
    </ContentBlock>
  );
}
