import ArrowIcon from '~/assets/arrow.svg';
import { Image } from '~/components-styled/cms/image-block';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import siteText from '~/locale';
import { Block, ImageBlock } from '~/types/cms';
import { Box } from './base';
import { RichContent } from './cms/rich-content';
import { Heading } from './typography';

type ArticleSummaryProps = {
  slug: string;
  title: string;
  summary: Block | null;
  cover: ImageBlock;
};

export function ArticleSummary(props: ArticleSummaryProps) {
  const { slug, title, summary, cover } = props;

  return (
    <Box border="solid" borderWidth={1} borderColor="border" borderRadius={4}>
      {cover && (
        <Box mx={-4}>
          <Image node={cover} />
        </Box>
      )}
      <Box padding={3}>
        <Heading level={3}>{title}</Heading>
        {summary && (
          <Box mx={-4}>
            <RichContent blocks={summary} />
          </Box>
        )}
        <LinkWithIcon
          href={`/artikelen/${slug}`}
          icon={<ArrowIcon />}
          iconPlacement="right"
        >
          {siteText.common.read_more}
        </LinkWithIcon>
      </Box>
    </Box>
  );
}
