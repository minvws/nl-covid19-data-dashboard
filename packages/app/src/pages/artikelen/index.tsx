import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { Heading, InlineText, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import {
  categories,
  CategoriesTypes,
  categoryAll,
} from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>(() => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;

    return `*[_type == 'article'] | order(publicationDate desc) {
        "title":title.${locale},
        slug,
        "summary":summary.${locale},
        "categories": [...categories],
        "cover": {
          ...cover,
          "asset": cover.asset->
        }
      }`;
  })
);

const allCategories = [categoryAll, ...categories] as unknown as (
  | CategoriesTypes
  | typeof categoryAll
)[];

const ArticlesOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();
  const { query, push } = useRouter();

  const handleFilter = useCallback(
    function setNewParam(item: CategoriesTypes | typeof categoryAll) {
      push(
        {
          pathname: '/artikelen',
          query: { filter: item },
        },
        undefined,
        { shallow: true }
      );
    },
    [push]
  );

  // When page first loads and there are no params, select all the articles
  useEffect(() => {
    if (isDefined(query.filter)) return;

    handleFilter(categoryAll);
  }, [query, push, handleFilter]);

  return (
    <Layout {...siteText.articles_metadata} lastGenerated={lastGenerated}>
      <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
        <MaxWidth px={{ _: 3, lg: 4 }}>
          <Heading level={2} as="h1" mb={2} lineHeight={0}>
            {siteText.common_actueel.secties.artikelen.titel}
          </Heading>

          <Text mb={3}>
            {siteText.common_actueel.secties.artikelen.beschrijving}
          </Text>

          <OrderedList>
            {allCategories.map((item, index) => (
              <ListItem
                key={index}
                isActive={query.categorieen === item}
                onClick={() => handleFilter(item)}
              >
                <StyledButton>
                  <InlineText>{item}</InlineText>
                  <BoldText aria-hidden="true">{item}</BoldText>
                </StyledButton>
              </ListItem>
            ))}
          </OrderedList>

          <ArticleList
            articleSummaries={content}
            hideLink={true}
            currentCategory={
              query.filter as CategoriesTypes | typeof categoryAll
            }
          />
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default ArticlesOverview;

const OrderedList = styled.ol(
  css({
    position: 'relative',
    m: 0,
    p: 0,
    mb: 5,
    listStyleType: 'none',
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: 'silver',
    display: 'flex',
    justifyContent: 'space-around',
    overflow: 'hidden',
  })
);

const ListItem = styled.li<{ isActive: boolean }>((x) =>
  css({
    position: 'relative',
    height: '100%',
    py: 3,
    transition: 'transform 0.2s',
    cursor: 'pointer',

    '&:after': {
      content: '""',
      position: 'absolute',
      left: '-1.5rem',
      bottom: 0,
      height: '6px',
      width: `calc(100% + 3rem)`,
      backgroundColor: 'blue',
      display: 'block',
      transform: `translateY(${x.isActive ? 0 : '6px'})`,
      transition: 'transform 0.2s',
    },

    span: {
      // Regular text
      ':nth-of-type(1)': {
        opacity: x.isActive ? 0 : 1,
      },

      // Bold text
      ':nth-of-type(2)': {
        opacity: x.isActive ? 1 : 0,
      },
    },

    ':hover': {
      '&:after': {
        transform: `translateY(0)`,
      },
    },
  })
);

const BoldText = styled.span(
  css({
    fontWeight: 'bold',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  })
);

const StyledButton = styled.button(
  css({
    all: 'unset',
    position: 'relative',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
  })
);
