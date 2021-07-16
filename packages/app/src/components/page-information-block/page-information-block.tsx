import css from '@styled-system/css';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import { Heading, HeadingLevel, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { asResponsiveArray } from '~/style/utils';
import { Articles } from './articles';
import { Metadata, MetadataProps } from './metadata';
import { UsefulLinks } from './useful-links';

interface InformationBlockProps {
  title?: string;
  icon?: JSX.Element;
  description: string;
  articles?: ArticleSummary[];
  usefulLinks?: {
    title: string;
    href: string;
  }[];
  headingLevel?: HeadingLevel;
  metadata?: MetadataProps;
  referenceLink?: string;
  id?: string;
  category?: string;
  screenReaderCategory?: string;
}

export function PageInformationBlock({
  title,
  icon,
  description,
  articles,
  usefulLinks,
  metadata,
  referenceLink,
  id,
  category,
  screenReaderCategory,
}: InformationBlockProps) {
  const MetaDataBlock = (
    <>
      {metadata && (
        <MetadataBox>
          <Metadata
            {...metadata}
            accessibilitySubject={title}
            referenceLink={referenceLink}
          />
        </MetadataBox>
      )}
    </>
  );

  return (
    <Box as="header" id={id} spacing={2}>
      {title && icon ? (
        <HeadingWithIcon
          icon={icon}
          title={title}
          category={category}
          screenReaderCategory={screenReaderCategory}
          headingLevel={2}
        />
      ) : (
        <Box display="flex" flexWrap="nowrap" alignItems="center">
          {category && (
            <Heading level={1} m={0} fontSize="1.25rem">
              {category}
              {screenReaderCategory && (
                <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>
              )}
            </Heading>
          )}
          <Heading mb={3} lineHeight={1.3} level={2}>
            {title}
          </Heading>
        </Box>
      )}

      <Tile>
        <Box
          display={{ md: 'grid' }}
          gridTemplateColumns="repeat(2, 1fr)"
          width="100%"
          css={css({
            columnGap: 4,
          })}
        >
          {articles && articles.length > 0 ? (
            <>
              <Box spacing={3}>
                <Text mb={0}>{description}</Text>
                {MetaDataBlock}
              </Box>
              <Box>
                <Articles articles={articles} />
              </Box>
            </>
          ) : (
            <>
              <Text mb={0}>{description}</Text>
              {MetaDataBlock}
            </>
          )}
        </Box>

        {usefulLinks && usefulLinks.length > 0 && (
          <Box
            borderTop="1px solid"
            borderTopColor="border"
            width="100%"
            pt={3}
            mt={3}
          >
            <UsefulLinks links={usefulLinks} />
          </Box>
        )}
      </Tile>
    </Box>
  );
}

const Tile = styled.div(
  css({
    bg: 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',
    display: 'flex',
    flexWrap: 'wrap',
  })
);

const MetadataBox = styled(Box)(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
    mb: asResponsiveArray({ _: 3, md: 0 }),
  })
);
