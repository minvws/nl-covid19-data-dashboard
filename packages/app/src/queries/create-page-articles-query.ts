type ArticlePageSchema =
  | 'deceasedPage'
  | 'behaviorPage'
  | 'hospitalPage'
  | 'intensiveCarePage'
  | 'positiveTestsPage'
  | 'in_positiveTestsPage'
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
  schemaName: ArticlePageSchema,
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
