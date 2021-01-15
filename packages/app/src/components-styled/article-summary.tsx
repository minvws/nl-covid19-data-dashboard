import { Box } from './base';
import { ReadMoreLink } from './read-more-link';
import { Heading, Text } from './typography';

type ArticleSummaryProps = {
  slug: string;
  title: string;
  summary: string;
  coverImageSrc: string;
};

export function ArticleSummary(props: ArticleSummaryProps) {
  const { slug, title, summary } = props;

  return (
    <Box border="solid" borderWidth={1} borderColor="border">
      <Box padding={3}>
        <Heading level={3}>{title}</Heading>
        <Text>{summary}</Text>
        <ReadMoreLink route={`/artikelen/${slug}`} text={'Lees meer'} />
      </Box>
    </Box>
  );
}
