import css from '@styled-system/css';
import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { SanityImage } from '~/components-styled/cms/sanity-image';
import { MaxWidth } from '~/components-styled/max-width';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';

interface ContentImageProps {
  node: ImageBlock | RichContentImageBlock;
  contentWrapper?: FunctionComponent;
  sizes?: number[][];
}

const SanityImageTile = styled(SanityImage)(
  css({
    borderRadius: 1,
    boxShadow: 'tile',
  })
);

const IMAGE_MAX_WIDTH = 980;

export function ContentImage({
  node,
  contentWrapper,
  sizes,
}: ContentImageProps) {
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
          maxWidth={IMAGE_MAX_WIDTH}
        >
          <SanityImageTile
            {...getImageProps(node, {
              sizes: [[IMAGE_MAX_WIDTH, IMAGE_MAX_WIDTH]],
            })}
          />

          {caption}
        </Box>
      </MaxWidth>
    </Box>
  ) : (
    <ContentWrapper>
      <Box as="figure" role="group" spacing={3} my={2} textAlign="center">
        <Box mb={3}>
          <SanityImage {...getImageProps(node, { sizes })} />
        </Box>
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
