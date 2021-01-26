import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { MaxWidth } from '~/components-styled/max-width';
import { urlFor } from '~/lib/sanity';
import { ImageBlock, RichContentImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';

export function Image({ node }: { node: ImageBlock | RichContentImageBlock }) {
  const url = urlFor(node).toString();
  assert(
    url !== null,
    `could not get url for node: ${JSON.stringify(node, null, 2)}`
  );

  const caption = 'caption' in node && node.caption && (
    <figcaption>{node.caption}</figcaption>
  );

  return 'isFullWidth' in node && node.isFullWidth ? (
    <Box bg="page">
      <MaxWidth py={4} px={4}>
        <Box as="figure" role="group" spacing={3}>
          <Box
            as="img"
            display="block"
            borderRadius={1}
            boxShadow="tile"
            src={url}
            alt={node.alt}
          />
          {caption}
        </Box>
      </MaxWidth>
    </Box>
  ) : (
    <ContentBlock>
      <Box as="figure" role="group" spacing={3} textAlign="center">
        <Box as="img" display="block" src={url} alt={node.alt} />
        {caption}
      </Box>
    </ContentBlock>
  );
}
