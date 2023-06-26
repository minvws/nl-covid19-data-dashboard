import { isDefined } from 'ts-is-present';
import { ArticleParts, DataExplainedParts, FaqParts, HighlightedItemParts, LinkParts, PageIdentifier, PagePart, RichTextParts } from '~/types/cms';

export const isArticleParts = (value: PagePart): value is ArticleParts => {
  return value._type === 'pageArticles';
};

export const isDataExplainedParts = (value: PagePart): value is DataExplainedParts => {
  return value._type === 'pageDataExplained';
};

export const isFaqParts = (value: PagePart): value is FaqParts => {
  return value._type === 'pageFAQs';
};

export const isHighlightedItemParts = (value: PagePart): value is HighlightedItemParts => {
  return value._type === 'pageHighlightedItems';
};

export const isLinkParts = (value: PagePart): value is LinkParts => {
  return value._type === 'pageLinks';
};

export const isRichTextParts = (value: PagePart): value is RichTextParts => {
  return value._type === 'pageRichText';
};

export const getPagePartsQuery = (pageIdentifier: PageIdentifier) => {
  const query = `//groq
    *[_type == 'pageIdentifier' && identifier == '${pageIdentifier}']
    {
      identifier,
      "pageParts": *[pageIdentifier._ref == ^._id]{
        _type,
        pageDataKind,
        (_type == 'pageArticles') => {
          articles[]->{_id, title, slug, summary, intro, "cover": {"asset": cover.asset->}, mainCategory[0], publicationDate}
        },
        (_type == 'pageFAQs') => {
          faqQuestions[]->{_id, title, content}
        },
        (_type == 'pageDataExplained') => {
          dataExplainedItem->{slug}
        },
        (_type == 'pageHighlightedItems') => {
          showWeeklyHighlight,
          highlights[]{title, category, "slug": {"current": href}, "cover": {"asset": cover.asset->}}
        },
        (_type == 'pageLinks') => {
          links[]{href, title}
        },
        (_type == 'pageRichText') => {
          text
        },
      }
    }[0]`;

  return query;
};

export const getArticleParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isArticleParts).find((pagePart) => pagePart.pageDataKind === pageDataKind)?.articles;
  return isDefined(parts) ? parts : null;
};

export const getDataExplainedParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isDataExplainedParts).find((pagePart) => pagePart.pageDataKind === pageDataKind)?.dataExplainedItem;
  return isDefined(parts) ? parts : null;
};

export const getFaqParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isFaqParts).find((pagePart) => pagePart.pageDataKind === pageDataKind)?.faqQuestions;
  return isDefined(parts) ? parts : null;
};

export const getHighlightedItemParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isHighlightedItemParts).find((pagePart) => pagePart.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        highlights: parts.highlights,
        showWeeklyHighlight: parts.showWeeklyHighlight,
      }
    : null;
};

export const getLinkParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isLinkParts).find((pagePart) => pagePart.pageDataKind === pageDataKind)?.links;
  return isDefined(parts) ? parts : null;
};

export const getRichTextParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = pageParts.filter(isRichTextParts).find((pagePart) => pagePart.pageDataKind === pageDataKind)?.text;
  return isDefined(parts) ? parts : null;
};
