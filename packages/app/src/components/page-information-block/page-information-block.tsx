import css from '@styled-system/css';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { HeadingLevel, Text } from '~/components/typography';
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
        <Text>{description}</Text>
      ) : (
        <RichContent blocks={description} />
      )}
    </Box>
  ) : null;

  return (
    <Box as="header" id={id} spacing={{ _: 3, md: 4 }}>
      {title && (
        <Header
          icon={icon}
          title={title}
          category={category}
          screenReaderCategory={screenReaderCategory}
        />
      )}

      {description && (
        <Tile>
          <Box spacing={3}>
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
              <>
                <Box height="1px" bg="border" />
                <UsefulLinks links={usefulLinks} />
              </>
            )}
          </Box>
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
