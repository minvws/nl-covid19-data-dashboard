import css from '@styled-system/css';
import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Image } from '~/components-styled/image';
import { MaxWidth } from '~/components-styled/max-width';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';

interface ContentImageProps {
  node: ImageBlock | RichContentImageBlock;
  contentWrapper?: FunctionComponent;
}

export function ContentImage({ node, contentWrapper }: ContentImageProps) {
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
          <Image {...getImageProps(node)} borderRadius={1} boxShadow="tile" />
          {caption}
        </Box>
      </MaxWidth>
    </Box>
  ) : (
    <ContentWrapper>
      <Box as="figure" role="group" spacing={3} my={2} textAlign="center">
        <Image {...getImageProps(node)} />
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
