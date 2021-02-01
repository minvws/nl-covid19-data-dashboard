import { targetLanguage } from '~/locale';

type ArticlePageSchema =
  | 'deceasedPage'
  | 'behaviorPage'
  | 'hospitalPage'
  | 'intensiveCarePage'
  | 'positiveTestsPage'
  | 'reproductionPage'
  | 'sewerPage'
  | 'vaccinationsPage';

export function createPageArticlesQuery(schemaName: ArticlePageSchema) {
  return `*[_type == '${schemaName}']{"articles":[...articles[]->{"title":title.${targetLanguage},
  slug,
  "summary":summary.${targetLanguage},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}]}[0]`;
}
