import ArrowIcon from '~/assets/arrow.svg';
import { Image } from '~/components-styled/cms/image-block';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { ArticleSummary } from '~/domain/topical/article-list';
import siteText from '~/locale';
import { Box } from './base';
import { Heading, Text } from './typography';

type ArticleLinkProps = {
  articleSummary: ArticleSummary;
};

export function ArticleLink(props: ArticleLinkProps) {
  const { articleSummary } = props;

  return (
    <Box
      border="solid"
      borderWidth={1}
      borderColor="border"
      borderRadius={4}
      minHeight={'26rem'}
      maxHeight={'26rem'}
      minWidth={{ _: '20rem', lg: '24rem' }}
      maxWidth={{ _: '20rem', lg: '24rem' }}
    >
      {articleSummary.cover && (
        <Box mx={-4}>
          <Image node={articleSummary.cover} />
        </Box>
      )}
      <Box padding={3}>
        <Heading level={3}>{articleSummary.title}</Heading>
        {articleSummary.summary && (
          <Box>
            <Text>{articleSummary.summary}</Text>
          </Box>
        )}
        <LinkWithIcon
          href={`/artikelen/${articleSummary.slug.current}`}
          icon={<ArrowIcon />}
          iconPlacement="right"
        >
          {siteText.common.read_more}
        </LinkWithIcon>
      </Box>
    </Box>
  );
}
