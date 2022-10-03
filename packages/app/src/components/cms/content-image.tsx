import css from '@styled-system/css';
import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ContentBlock } from '~/components/cms/content-block';
import { SanityImage } from '~/components/cms/sanity-image';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';
import { Text } from '../typography';

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
    <Text as="figcaption" variant="body2" textAlign="left">
      {node.caption}
    </Text>
  );

  const ContentWrapper = contentWrapper ?? Fragment;

  return 'isFullWidth' in node && node.isFullWidth ? (
    <Box bg="gray1" p={4} width="100%">
      <Box
        as="figure"
        role="group"
        spacing={3}
        display="flex"
        maxWidth={IMAGE_MAX_WIDTH}
        textAlign="center"
        mx="auto"
      >
        <ContentBlock>
          {node.asset && (
            <SanityImageTile
              {...getImageProps(node, {
                sizes: [[IMAGE_MAX_WIDTH, IMAGE_MAX_WIDTH]],
              })}
            />
          )}

          {caption}
        </ContentBlock>
      </Box>
    </Box>
  ) : (
    <ContentWrapper>
      <Box as="figure" role="group" spacing={3} my={2} textAlign="center">
        <Box mb={3}>
          {node.asset && <SanityImage {...getImageProps(node, { sizes })} />}
        </Box>
        {caption}
      </Box>
    </ContentWrapper>
  );
}
