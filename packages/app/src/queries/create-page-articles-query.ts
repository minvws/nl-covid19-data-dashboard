import { ArticleSummary } from '~/components/article-teaser';

type ArticlePageType =
  | 'deceasedPage'
  | 'behaviorPage'
  | 'hospitalPage'
  | 'intensiveCarePage'
  | 'positiveTestsPage'
  | 'in_positiveTestsPage'
  | 'in_variantsPage'
  | 'reproductionPage'
  | 'sewerPage'
  | 'vaccinationsPage'
  | 'escalationLevelPage'
  | 'situationsPage'
  | 'variantsPage'
  | 'nursingHomePage'
  | 'disabilityCarePage'
  | 'elderlyAtHomePage'
  | 'infectiousPeoplePage';

/**
 * This query extracts articles from a page type. Pages in the CMS are set up so
 * that each page has their own type name and only one should exist for each
 * type. That's why the query uses [0] at the end, since the query returns a
 * list of results for the page type but only one should ever exist.
 *
 * Normally you would expect multiple pages to share the same type and only
 * differ in the way the document instance is filled, but this is not the case
 * in how it is currently set up.
 */
export function createPageArticlesQuery(
  pageTypeName: ArticlePageType,
  locale: string,
  articlesFieldName = 'articles'
) {
  // const query = `*[_type ==
  // '${schemaName}']{"articles":[...${fieldName}[]->{"title":title.${locale},
  // slug, "summary":summary.${locale}, "cover": {...cover, "asset":
  // cover.asset->}}]}[0]`;

  const query = `*[_type == '${pageTypeName}']{"articles": ${articlesFieldName}[]->{"title":title.${locale},
  slug,
  "summary":summary.${locale},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}}[0]`;

  // const query = `*[_type ==
  // '${schemaName}']{"articles":[...${fieldName}[]->{"title":title.${locale},
  // slug, "summary":summary.${locale}, "cover": {...cover, "asset":
  // cover.asset->
  // }}]}`;

  return query;
}

export type ArticlesQueryResult = { articles?: ArticleSummary[] };
