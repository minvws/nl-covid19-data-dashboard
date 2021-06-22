import css from '@styled-system/css';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import { Heading, HeadingLevel, Text } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
import { Articles } from './articles';
import { Metadata, MetadataProps } from './metadata';
import { UsefulLinks } from './useful-links';

interface InformationBlockProps {
  title: string;
  icon?: JSX.Element;
  description: string;
  articles?: ArticleSummary[];
  usefulLinks?: {
    title: string;
    href: string;
  }[];
  headingLevel?: HeadingLevel;
  metadata?: MetadataProps;
  reference?: {
    href: string;
    text: string;
  };
  skipLinkAnchor?: boolean;
  id?: string;
}

export function InformationBlock({
  title,
  icon,
  description,
  headingLevel = 2,
  articles,
  usefulLinks,
  metadata,
  reference,
  skipLinkAnchor,
  id,
}: InformationBlockProps) {
  return (
    <header id={id}>
      {icon ? (
        <HeadingWithIcon
          icon={icon}
          title={title}
          headingLevel={headingLevel}
        />
      ) : (
        <Box display="flex" flexWrap="nowrap" alignItems="center">
          <Heading level={headingLevel} mb={0} lineHeight={1.3}>
            {title}
          </Heading>
        </Box>
      )}
      <Tile>
        <Box
          display={{ _: 'block', md: 'grid' }}
          gridTemplateColumns="repeat(2, 1fr)"
          width="100%"
          css={css({
            columnGap: 3,
          })}
        >
          {articles && articles.length > 0 ? (
            <>
              <Box spacing={3}>
                <Text>{description}</Text>
                {metadata && (
                  <MetadataBox>
                    <Metadata
                      {...metadata}
                      accessibilitySubject={title}
                      reference={reference}
                    />
                  </MetadataBox>
                )}
              </Box>
              <Box mb={{ _: usefulLinks ? 3 : 0, md: 0 }}>
                <Articles articles={articles} />
              </Box>
            </>
          ) : (
            <>
              <Text>{description}</Text>
              {metadata && (
                <MetadataBox>
                  <Metadata
                    {...metadata}
                    accessibilitySubject={title}
                    reference={reference}
                  />
                </MetadataBox>
              )}
            </>
          )}
        </Box>

        {usefulLinks && usefulLinks.length > 0 && (
          <Box
            borderTop="1px solid"
            borderTopColor="border"
            width="100%"
            pt={3}
          >
            <UsefulLinks links={usefulLinks} />
          </Box>
        )}
      </Tile>
    </header>
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
  })
);
