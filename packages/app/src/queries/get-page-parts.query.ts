import { ArticleSummary } from '~/components/article-teaser';

export type PageIdentifier =
  | 'in_positiveTestsPage'
  | 'hospitalPage'
  | 'in_positiveTestsPage'
  | 'in_variantsPage'
  | 'behaviorPage'
  | 'situationsPage'
  | 'reproductionPage'
  | 'infectiousPeoplePage'
  | 'topicalPage'
  | 'elderlyAtHomePage'
  | 'disabilityCarePage'
  | 'positiveTestsPage'
  | 'variantsPage'
  | 'sewerPage'
  | 'intensiveCarePage'
  | 'vaccinationsPage'
  | 'in_variantsPage'
  | 'nursingHomePage'
  | 'deceasedPage';

export type PageBasePart = {
  pageDataKind: string;
};

export type ArticleParts = {
  _type: 'pageArticles';
  articles: ArticleSummary[];
} & PageBasePart;

export type LinkParts = {
  _type: 'pageLinks';
  links: {
    title: string;
    href: string;
  }[];
} & PageBasePart;

export type HighlightedItemParts = {
  _type: 'pageHighlightedItems';
  highlights: any[];
} & PageBasePart;

export type PagePart = ArticleParts | LinkParts | HighlightedItemParts;

export type PagePartQueryResult<T extends PagePart = PagePart> = {
  pageParts: T[];
};

export function isArticleParts(value: PagePart): value is ArticleParts {
  return value._type === 'pageArticles';
}

export function isLinkParts(value: PagePart): value is LinkParts {
  return value._type === 'pageLinks';
}

export function isHighlightedItemParts(
  value: PagePart
): value is HighlightedItemParts {
  return value._type === 'pageHighlightedItems';
}

export function getPagePartsQuery(pageIdentifier: PageIdentifier) {
  const query = `
    *[_type == 'pageIdentifier' && identifier == '${pageIdentifier}']
    {
      identifier,
      "pageParts": *[pageIdentifier._ref == ^._id]{
        (articles != undefined) => {
          _type,
          pageDataKind,
          articles[]->{_id, title, slug, intro, "cover": {"asset": cover.asset->}}
        },
        (links != undefined) => {
          _type,
          pageDataKind,
          links[]{href, title}
        },
        (highlights != undefined) => {
          _type,
          pageDataKind,
          highlights[]{title, category, href, "cover": {"asset": cover.asset->}}
        },
      }
    }[0]`;

  return query;
}
