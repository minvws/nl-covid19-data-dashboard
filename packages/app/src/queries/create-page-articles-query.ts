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

export function createPageArticlesQuery(
  schemaName: ArticlePageType,
  locale: string,
  fieldName = 'articles'
) {
  const query = `*[_type == '${schemaName}']{"articles":[...${fieldName}[]->{"title":title.${locale},
  slug,
  "summary":summary.${locale},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}]}[0]`;

  return query;
}

export type ArticlesQueryResult = { articles?: ArticleSummary[] };
