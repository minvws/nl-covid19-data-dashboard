import { isDefined } from 'ts-is-present';
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

export function getArticleParts(pageParts: PagePart[], pageDataKind: string) {
  const parts = pageParts
    .filter(isArticleParts)
    .find((x) => x.pageDataKind === pageDataKind)?.articles;
  return isDefined(parts) ? parts : null;
}

export function getLinkParts(pageParts: PagePart[], pageDataKind: string) {
  const parts = pageParts
    .filter(isLinkParts)
    .find((x) => x.pageDataKind === pageDataKind)?.links;
  return isDefined(parts) ? parts : null;
}

export function getHighlightedItemParts(
  pageParts: PagePart[],
  pageDataKind: string
) {
  const parts = pageParts
    .filter(isHighlightedItemParts)
    .find((x) => x.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        highlights: parts.highlights,
        showWeeklyHighlight: parts.showWeeklyHighlight,
      }
    : null;
}

export function getRichTextParts(pageParts: PagePart[], pageDataKind: string) {
  const parts = pageParts
    .filter(isRichTextParts)
    .find((x) => x.pageDataKind === pageDataKind)?.text;
  return isDefined(parts) ? parts : null;
}
