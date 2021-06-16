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
  locale: string,
  name = 'articles'
) {
  const query = `*[_type == '${schemaName}']{"articles":[...${name}[]->{"title":title.${locale},
  slug,
  "summary":summary.${locale},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}]}[0]`;

  return query;
}
