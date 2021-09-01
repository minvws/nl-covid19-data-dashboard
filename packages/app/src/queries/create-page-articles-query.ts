import { ArticleSummary } from '~/components/article-teaser';

/**
 * We might want to remove this, because it locks you in a specific set of pages?
 */
type PageIdentifier =
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
 * This query fetches an article page with a specific slug.
 */
export function createPageArticlesQuery(
  pageIdentifier: PageIdentifier,
  locale: string
) {
  const query = `
    *[_type == 'articlePage' && slug.current == '${pageIdentifier}']{

      "articleLists": *[_type=='articlePageArticle' && references(^._id)] {
        articles[] -> {
          "title":title.${locale},
          slug,
          "summary":summary.${locale},
          "cover": {
            ...cover,
            "asset": cover.asset->
          }
        }
      },
      "linkLists": *[_type=='articlePageLinks' && references(^._id)] {
        links []->{
          ...
        }
      }
    }[0]`;

  return query;
}

export type PageArticlesQueryResult = { articles?: ArticleSummary[] };
