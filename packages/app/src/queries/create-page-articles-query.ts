type ArticlePageSchema =
  | 'deceasedPage'
  | 'behaviorPage'
  | 'hospitalPage'
  | 'intensiveCarePage'
  | 'positiveTestsPage'
  | 'reproductionPage'
  | 'sewerPage'
  | 'vaccinationsPage'
  | 'escalationLevelPage'
  | 'situationsPage'
  | 'variantsPage';

export function createPageArticlesQuery(
  schemaName: ArticlePageSchema,
  locale: string
) {
  const query = `*[_type == '${schemaName}']{"articles":[...articles[]->{"title":title.${locale},
  slug,
  "summary":summary.${locale},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}]}[0]`;

  return query;
}
