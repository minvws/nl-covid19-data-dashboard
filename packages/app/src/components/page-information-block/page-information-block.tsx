import css from '@styled-system/css';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Heading, HeadingLevel, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { asResponsiveArray } from '~/style/utils';
import { RichContentBlock } from '~/types/cms';
import { Articles } from './components/articles';
import { Header } from './components/header';
import { Metadata, MetadataProps } from './components/metadata';
import { UsefulLinks } from './components/useful-links';

interface InformationBlockProps {
  title?: string;
  icon?: JSX.Element;
  description?: string | RichContentBlock[];
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
  const MetaDataBlock = metadata ? (
    <MetadataBox>
      <Metadata
        {...metadata}
        accessibilitySubject={title}
        referenceLink={referenceLink}
      />
    </MetadataBox>
  ) : null;

  const DescriptionBlock = description ? (
    <Box maxWidth="maxWidthText">
      {typeof description === 'string' ? (
        <Text mb={0}>{description}</Text>
      ) : (
        <RichContent blocks={description} />
      )}
    </Box>
  ) : null;

  return (
    <Box as="header" id={id} spacing={{ _: 3, md: 4 }}>
      {title && icon ? (
        <Header
          icon={icon}
          title={title}
          category={category}
          screenReaderCategory={screenReaderCategory}
        />
      ) : (
        <>
          {title ? (
            <Box display="flex" flexWrap="nowrap" flexDirection="column">
              {category && (
                <Heading level={1} m={0} fontSize="1.25rem" color="category">
                  {category}
                  {screenReaderCategory && (
                    <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>
                  )}
                </Heading>
              )}
              <Heading mb={description ? 3 : 0} lineHeight={1.3} level={2}>
                {title}
              </Heading>
            </Box>
          ) : null}
        </>
      )}

      {description && (
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
                  {DescriptionBlock}
                  {MetaDataBlock}
                </Box>

                <Articles articles={articles} />
              </>
            ) : (
              <>
                {DescriptionBlock}
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
      )}
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

const MetadataBox = styled.div(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
    mb: asResponsiveArray({ _: 3, md: 0 }),
  })
);
