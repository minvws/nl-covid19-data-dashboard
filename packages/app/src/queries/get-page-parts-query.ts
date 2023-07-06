import { isDefined } from 'ts-is-present';
import { ArticleParts, DataExplainedParts, FaqParts, HighlightedItemParts, LinkParts, PageIdentifier, PagePart, RichTextParts } from '~/types/cms';

export const getPagePartsQuery = (pageIdentifier: PageIdentifier) => {
  const query = `//groq
    *[_type == 'pageIdentifier' && identifier == '${pageIdentifier}']
    {
      identifier,
      "pageParts": *[pageIdentifier._ref == ^._id]{
        _type,
        pageDataKind,
        (_type == 'pageArticles') => {
          articles[]->{_id, title, slug, summary, intro, "cover": {"asset": cover.asset->}, mainCategory, publicationDate, updatedDate},
          sectionTitle
        },
        (_type == 'pageFAQs') => {
          questions[]->{_id, title, content},
          buttonTitle,
          buttonText,
          sectionTitle
        },
        (_type == 'pageDataExplained') => {
          item->{slug},
          buttonTitle,
          buttonText
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

const isOfType = <T extends PagePart>(value: PagePart, type: string): value is T => value._type === type;

const filterByType = <T extends PagePart>(pageParts: PagePart[], type: string): T[] => pageParts.filter((value): value is T => isOfType<T>(value, type));

export const getArticleParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<ArticleParts>(pageParts, 'pageArticles').find((pagePart) => pagePart.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        articles: parts.articles,
        sectionTitle: parts.sectionTitle,
      }
    : null;
};

export const getDataExplainedParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<DataExplainedParts>(pageParts, 'pageDataExplained').find((pagePart) => pagePart.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        item: parts.item,
        buttonTitle: parts.buttonTitle,
        buttonText: parts.buttonText,
      }
    : null;
};

export const getFaqParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<FaqParts>(pageParts, 'pageFAQs').find((pagePart) => pagePart.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        questions: parts.questions,
        buttonTitle: parts.buttonTitle,
        buttonText: parts.buttonText,
        sectionTitle: parts.sectionTitle,
      }
    : null;
};

export const getHighlightedItemParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<HighlightedItemParts>(pageParts, 'pageHighlightedItems').find((pagePart) => pagePart.pageDataKind === pageDataKind);
  return isDefined(parts)
    ? {
        highlights: parts.highlights,
        showWeeklyHighlight: parts.showWeeklyHighlight,
      }
    : null;
};

export const getLinkParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<LinkParts>(pageParts, 'pageLinks').find((pagePart) => pagePart.pageDataKind === pageDataKind)?.links;
  return isDefined(parts) ? parts : null;
};

export const getRichTextParts = (pageParts: PagePart[], pageDataKind: string) => {
  const parts = filterByType<RichTextParts>(pageParts, 'pageRichText').find((pagePart) => pagePart.pageDataKind === pageDataKind)?.text;
  return isDefined(parts) ? parts : null;
};
