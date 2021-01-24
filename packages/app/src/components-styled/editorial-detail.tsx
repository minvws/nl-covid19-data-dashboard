import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Image } from '~/components-styled/cms/image';
import { Heading } from '~/components-styled/typography';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale';
import { Editorial } from '~/types/cms';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';

interface EditorialDetailProps {
  editorial: Editorial;
}

export function EditorialDetail({ editorial }: EditorialDetailProps) {
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon
          href="/weekberichten"
          icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
        >
          {siteText.editorial_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {editorial.title}
          </Heading>
          {editorial.publicationDate && (
            <time
              css={css({ color: 'gray' })}
              dateTime={editorial.publicationDate}
            >
              {formatDateFromMilliseconds(
                new Date(editorial.publicationDate).getTime(),
                'medium'
              )}
            </time>
          )}
        </Box>

        {editorial.intro && (
          <Box fontWeight="bold">
            <PortableText blocks={editorial.intro} />
          </Box>
        )}

        {editorial.cover && <Image node={editorial.cover} />}
      </ContentBlock>

      {!!editorial.content?.length && (
        <RichContent blocks={editorial.content} />
      )}
    </Box>
  );
}
