import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { Heading, Text } from '~/components/typography';
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

const ArticlesOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();
  const { query, push } = useRouter();

  function handleParams(item: CategoriesTypes | typeof categoryAll) {
    push(
      {
        pathname: '/artikelen',
        query: { categorieen: item },
      },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (isDefined(query.categorieen)) return;

    push(
      {
        pathname: '/artikelen',
        query: { categorieen: categoryAll },
      },
      undefined,
      { shallow: true }
    );
  }, [query, push]);

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
            <ListItem isActive={query.categorieen === categoryAll}>
              <StyledButton onClick={() => handleParams(categoryAll)}>
                {categoryAll}
                <BoldText aria-hidden="true">{categoryAll}</BoldText>
              </StyledButton>
            </ListItem>

            {categories.map((item, index) => (
              <ListItem key={index} isActive={query.categorieen === item}>
                <StyledButton onClick={() => handleParams(item)}>
                  {item}
                  <BoldText aria-hidden="true">{item}</BoldText>
                </StyledButton>
              </ListItem>
            ))}
          </OrderedList>

          <ArticleList
            articleSummaries={content}
            hideLink={true}
            currentCategory={
              query.categorieen as CategoriesTypes | typeof categoryAll
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
    borderTop: '1px solid gray',
    borderBottom: '1px solid gray',
    display: 'flex',
    justifyContent: 'space-around',
  })
);

const ListItem = styled.li<{ isActive: boolean }>((x) =>
  css({
    position: 'relative',
    height: '100%',
    py: 2,
    transition: 'transform 0.2s',

    '&:after': {
      content: '""',
      position: 'absolute',
      left: -2,
      bottom: 0,
      height: '5px',
      width: `calc(100% + 1rem)`,
      backgroundColor: 'blue',
      display: 'block',
      transform: `translateY(${x.isActive ? 0 : '5px'})`,
      transition: 'transform 0.2s',
    },
  })
);

const BoldText = styled.span(
  css({
    fontWeight: 'bold',
    visibility: 'hidden',
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
    cursor: 'pointer',

    // '&:after': {
    //   // content: x.isFirst ? '""' : 'none',
    //   content: '""',
    //   position: 'absolute',
    //   right: '-50%',
    //   top: 0,
    //   height: '100%',
    //   width: '1px',
    //   backgroundColor: 'red',
    //   display: 'block',
    // },

    ':hover': {
      visibility: 'hidden',

      span: {
        visibility: 'visible',
        color: '#000',
      },
    },
  })
);
