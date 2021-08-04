import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ContentBlock } from '~/components/cms/content-block';
import { ContentImage } from '~/components/cms/content-image';
import { Heading, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Editorial } from '~/types/cms';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';

interface EditorialDetailProps {
  editorial: Editorial;
}

export function EditorialDetail({ editorial }: EditorialDetailProps) {
  const { siteText } = useIntl();
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/" icon={<ArrowIconLeft />}>
          {siteText.editorial_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1}>{editorial.title}</Heading>
          <InlineText color="annotation">
            <PublicationDate date={editorial.publicationDate} />
          </InlineText>
        </Box>

        <Box fontWeight="bold">
          <RichContent blocks={editorial.intro} contentWrapper={ContentBlock} />
        </Box>

        <ContentImage node={editorial.cover} contentWrapper={ContentBlock} />
      </ContentBlock>

      {!!editorial.content?.length && (
        <RichContent blocks={editorial.content} contentWrapper={ContentBlock} />
      )}
    </Box>
  );
}
