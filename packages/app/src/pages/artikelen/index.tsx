import { colors } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/articles/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { RichContentSelect } from '~/components/rich-content-select';
import { Heading, InlineText, Text } from '~/components/typography';
import { ArticlesList } from '~/components/articles/articles-list';
import { Layout } from '~/domain/layout/layout';
import { ArticleCategoryType, allPossibleArticleCategories } from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { StaticProps, createGetStaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { mediaQueries, space } from '~/style/theme';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { getCategories } from '~/components/articles/logic/get-categories';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textShared: siteText.pages.topical_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>((context) => {
    const { locale } = context;

    return `*[_type == 'article'] | order(publicationDate desc) {
        "title":title.${locale},
        slug,
        "summary":summary.${locale},
        "categories": [...categories],
        "cover": {
          ...cover,
          "asset": cover.asset->
        },
        publicationDate,
        mainCategory,
        updatedDate,
      }`;
  })
);

const Articles = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, lastGenerated, content } = props;
  const { commonTexts } = useIntl();
  const { textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const articleCategories = useMemo(() => {
    // Find all categories currently active on published articles. Used later to filter out items from the cateogry menu which are not used.
    const availableCategoriesWithDuplicates = content.map((item) => getCategories(item)).flat();
    const availableCategoriesWithoutDuplicates = new Set(availableCategoriesWithDuplicates);
    const allAvailableCategories: string[] = ['__alles', ...availableCategoriesWithoutDuplicates].filter(Boolean);
    const filteredArticleCategoryList = allPossibleArticleCategories.filter((item) => allAvailableCategories.includes(item));

    const articleCategoriesWithLabels = filteredArticleCategoryList.map((item) => {
      return {
        label: textShared.secties.artikelen.categorie_filters[item],
        value: item,
      };
    });

    return articleCategoriesWithLabels;
  }, [content, textShared.secties.artikelen.categorie_filters]);

  const narrowScreenDropdownConfig = useMemo(() => {
    const config = articleCategories.map((category) => {
      return {
        ...category,
        content: (
          <Box paddingRight={space[2]}>
            <Text>{category.label}</Text>
          </Box>
        ),
      };
    });

    return config;
  }, [articleCategories]);

  const handleCategoryFilter = useCallback(
    (item: ArticleCategoryType) => {
      router.replace({ pathname: '/artikelen', query: { category: item } }, undefined, { shallow: true });
    },
    [router]
  );

  const currentCategory = (
    allPossibleArticleCategories.includes(router.query.category as ArticleCategoryType) ? router.query.category : allPossibleArticleCategories[0]
  ) as ArticleCategoryType;

  return (
    <Layout {...commonTexts.articles_metadata} lastGenerated={lastGenerated}>
      <Box as="section" backgroundColor="white" paddingY={{ _: space[4], md: space[5] }}>
        <MaxWidth paddingX={{ _: space[3], lg: space[4] }}>
          <Box paddingBottom={space[2]}>
            <Heading level={2} as="h1">
              {textShared.secties.artikelen.titel}
            </Heading>
          </Box>

          <Text>{textShared.secties.artikelen.beschrijving}</Text>

          {breakpoints.lg ? (
            <OrderedList>
              {articleCategories.map((category, index) => (
                <ListItem key={index} isActive={currentCategory === category.value} onClick={() => handleCategoryFilter(category.value)} role="button">
                  <StyledButton>
                    <InlineText>{category.label}</InlineText>
                    <BoldText aria-hidden="true">{category.label}</BoldText>
                  </StyledButton>
                </ListItem>
              ))}
            </OrderedList>
          ) : (
            <NarrowScreenDropDownContainer>
              <RichContentSelect
                label={textShared.secties.artikelen.categorie_select_placeholder}
                initialValue={currentCategory}
                options={narrowScreenDropdownConfig}
                onChange={(item) => handleCategoryFilter(item.value)}
                visuallyHiddenLabel
              />
            </NarrowScreenDropDownContainer>
          )}

          {content && content.length && <ArticlesList articleList={content} currentCategory={currentCategory} />}
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default Articles;

const NarrowScreenDropDownContainer = styled.div`
  margin-top: ${space[3]};
  margin-bottom: ${space[4]};
  width: 100%;

  select {
    width: 100%;
    max-width: 25rem;

    @media ${mediaQueries.xs} {
      max-width: 23rem;
    }
  }
`;

const OrderedList = styled.ol`
  border-bottom: 1px solid ${colors.gray3};
  border-top: 1px solid ${colors.gray3};
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  margin: ${space[4]} 0;
  overflow: hidden;
  padding: 0;
  position: relative;
`;

interface ListItem {
  isActive: boolean;
}

const ListItem = styled.li<ListItem>`
  cursor: pointer;
  height: 100%;
  padding-block: ${space[3]};
  position: relative;
  transition: transform 0.2s;

  &::after {
    background-color: ${colors.blue8};
    bottom: 0;
    content: '';
    display: block;
    height: 5px;
    left: 0;
    position: absolute;
    transform: translateY(${({ isActive }) => (isActive ? 0 : '6px')});
    transition: transform 0.2s;
    width: 100%;
  }

  span {
    // Regular text
    &:nth-of-type(1) {
      opacity: ${({ isActive }) => (isActive ? 0 : 1)};
    }

    // Bold text
    &:nth-of-type(2) {
      opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    }
  }

  &:hover::after {
    transform: translateY(0);
  }
`;

/*
 * Since we are using a justify-content: space around for positioning the elements,
 * transforming them on hover to a bold text would cause a small layout shift.
 * Here we draw a identical text on top and switch them once the item is active.
 * It has a aria hidden label and is pure cosmetic for this use case.
 */
const BoldText = styled.span`
  font-weight: bold;
  left: 50%;
  opacity: 0;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const StyledButton = styled.button`
  all: unset;
  padding-inline: ${space[3]};
  position: relative;

  &:focus {
    outline-width: 1px;
    outline-style: dashed;
    outline-color: ${colors.blue8};
  }
`;
