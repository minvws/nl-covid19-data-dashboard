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
 * This query fetches the articles field from a page type document. Pages in the
 * CMS are set up so that each page has their own unique type name and so only
 * one should exist for each. This is why the query uses [0] at the end, because
 * a query by type returns a list of results but only one should ever exist.
 *
 * Usually in a document store you would expect multiple pages to share the same
 * type and only differ in the way the instance is filled, but this is not the
 * case in how it is currently set up.
 */
export function createPageArticlesQuery(
  pageTypeName: ArticlePageType,
  locale: string,
  articlesFieldName = 'articles'
) {
  const query = `
    *[_type == '${pageTypeName}']{
      "articles": ${articlesFieldName}[]->{
        "title":title.${locale},
        slug,
        "summary":summary.${locale},
        "cover": {
          ...cover,
          "asset": cover.asset->
        }
      }
    }[0]`;

  return query;
}

export type PageArticlesQueryResult = { articles?: ArticleSummary[] };
