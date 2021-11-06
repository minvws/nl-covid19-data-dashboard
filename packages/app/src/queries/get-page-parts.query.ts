import {
  ArticleParts,
  HighlightedItemParts,
  LinkParts,
  PageIdentifier,
  PagePart,
  RichTextParts,
} from '~/types/cms';

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

export function isRichTextParts(value: PagePart): value is RichTextParts {
  return value._type === 'pageRichText';
}

export function getPagePartsQuery(pageIdentifier: PageIdentifier) {
  const query = `
    *[_type == 'pageIdentifier' && identifier == '${pageIdentifier}']
    {
      identifier,
      "pageParts": *[pageIdentifier._ref == ^._id]{
        _type,
        pageDataKind,
        (_type == 'pageArticles') => {
          articles[]->{_id, title, slug, intro, "cover": {"asset": cover.asset->}}
        },
        (_type == 'pageLink') => {
          links[]{href, title}
        },
        (_type == 'pageHighlightedItems') => {
          showWeeklyHighlight,
          highlights[]{title, category, "slug": {"current": href}, "cover": {"asset": cover.asset->}}
        },
        (_type == 'pageRichText') => {
          text
        },
      }
    }[0]`;

  return query;
}
