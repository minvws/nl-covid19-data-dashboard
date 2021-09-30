import css from '@styled-system/css';
import { isValidElement, ReactNode } from 'react';
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
import { PageLinks } from './components/page-links';

interface InformationBlockProps {
  title?: string;
  icon?: JSX.Element;
  description?: string | RichContentBlock[] | ReactNode;
  articles?: ArticleSummary[];
  pageLinks?: {
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
  pageLinks,
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
      {isValidElement(description) ? (
        description
      ) : typeof description === 'string' ? (
        <Text>{description}</Text>
      ) : (
        <RichContent blocks={description as RichContentBlock[]} />
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
        <Tile hasTitle={!!title}>
          <Box spacing={3}>
            <Box
              display={{ md: 'grid' }}
              gridTemplateColumns="repeat(2, 1fr)"
              width="100%"
              spacing={{
                _: pageLinks && pageLinks.length > 0 ? 0 : 3,
                md: 0,
              }}
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

            {pageLinks && pageLinks.length > 0 && (
              <>
                <Box height="1px" bg="border" />
                <PageLinks links={pageLinks} />
              </>
            )}
          </Box>
        </Tile>
      )}
    </Box>
  );
}

const Tile = styled.div<{ hasTitle?: boolean }>((x) =>
  css({
    pb: asResponsiveArray({ _: 3, sm: 4 }),
    pt: x.hasTitle ? undefined : asResponsiveArray({ _: 3, sm: 4 }),
    display: 'flex',
    flexWrap: 'wrap',
    borderTop: x.hasTitle ? undefined : 'solid 2px lightGray',
  })
);

const MetadataBox = styled.div(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
    mb: asResponsiveArray({ _: 3, md: 0 }),
  })
);
