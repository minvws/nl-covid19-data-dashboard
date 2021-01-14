import siteText from '~/locale';
import { Box } from './base';
import { ReadMoreLink } from './read-more-link';
import { Heading, Text } from './typography';

type ArticleSummaryProps = {
  slug: string;
  title: string;
  summary: string;
  imageSrc: string;
};

export function ArticleSummary(props: ArticleSummaryProps) {
  const { slug, title, summary, imageSrc } = props;

  return (
    <Box>
      <Heading level={3}>{title}</Heading>
      <Text>{summary}</Text>
      <ReadMoreLink
        route={`/articles/${slug}`}
        text={siteText.escalatie_niveau.lees_meer}
      />
    </Box>
  );
}
