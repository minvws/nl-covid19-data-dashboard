import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { ContentImage } from '~/components-styled/cms/content-image';
import { Heading } from '~/components-styled/typography';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale';
import { Editorial } from '~/types/cms';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';

interface EditorialDetailProps {
  editorial: Editorial;
}

export function EditorialDetail({ editorial }: EditorialDetailProps) {
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon
          href="/"
          icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
        >
          {siteText.editorial_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {editorial.title}
          </Heading>
          <PublicationDate date={editorial.publicationDate} />
        </Box>

        <Box fontWeight="bold">
          <PortableText blocks={editorial.intro} />
        </Box>

        <ContentImage node={editorial.cover} />
      </ContentBlock>

      {!!editorial.content?.length && (
        <RichContent blocks={editorial.content} />
      )}
    </Box>
  );
}
