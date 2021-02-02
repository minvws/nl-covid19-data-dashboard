import css from '@styled-system/css';
import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Image as SrcSetImage } from '~/components-styled/image';
import { MaxWidth } from '~/components-styled/max-width';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';

interface ImageProps {
  node: ImageBlock | RichContentImageBlock;
  contentWrapper?: FunctionComponent;
}

export function Image({ node, contentWrapper }: ImageProps) {
  const caption = 'caption' in node && node.caption && (
    <Caption>{node.caption}</Caption>
  );

  const ContentWrapper = contentWrapper ?? Fragment;

  return 'isFullWidth' in node && node.isFullWidth ? (
    <Box bg="page" p={4}>
      <MaxWidth textAlign="center">
        <Box
          as="figure"
          role="group"
          spacing={3}
          display="inline-block"
          maxWidth={980}
        >
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
    <ContentWrapper>
      <Box as="figure" role="group" spacing={3} my={2} textAlign="center">
        <SrcSetImage
          src={`/${node.asset.assetId}.${node.asset.extension}`}
          width={node.asset.metadata.dimensions.width}
          height={node.asset.metadata.dimensions.height}
          alt={node.alt}
        />
        {caption}
      </Box>
    </ContentWrapper>
  );
}

const Caption = styled.figcaption(
  css({
    textAlign: 'left',
    fontSize: 2,
  })
);
