type ArticlePageSchema =
  | 'deceasedPage'
  | 'behaviorPage'
  | 'hospitalPage'
  | 'intensiveCarePage'
  | 'positiveTestsPage'
  | 'reproductionPage'
  | 'sewerPage'
  | 'vaccinationsPage'
  | 'escalationLevelPage';

export function createPageArticlesQuery(schemaName: ArticlePageSchema) {
  //@TODO!
  // THIS NEEDS TO COME FROM CONTEXT! I DON'T WANT TO BLOCK MY PR PROGRESS ON FIGURING THIS OUT ATM.
  const locale = process.env.NEXT_PUBLIC_LOCALE;

  const query = `*[_type == '${schemaName}']{"articles":[...articles[]->{"title":title.${locale},
  slug,
  "summary":summary.${locale},
  "cover": {
    ...cover,
    "asset": cover.asset->
  }}]}[0]`;

  return query;
}
