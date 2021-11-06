import { GetStaticPropsContext } from 'next';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { WeeklyHighlightProps } from '~/domain/topical/highlights-tile';
import { createGetContent } from '~/static-props/get-data';
import {
  createElementsQuery,
  ElementsQueryResult,
} from './create-elements-query';
import {
  ArticleParts,
  getPagePartsQuery,
  HighlightedItemParts,
  isArticleParts,
  isHighlightedItemParts,
  PagePartQueryResult,
} from './get-page-parts.query';

export function getTopicalPageData(
  code: 'nl' | 'vr' | 'gm',
  elementNames: string[]
) {
  return async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts | HighlightedItemParts>;
      elements: ElementsQueryResult;
      riskLevel: { level: EscalationLevelType; dateFrom: string };
      weeklyHighlight: WeeklyHighlightProps;
    }>((context) => {
      const { locale } = context;
      return `{
       "parts": ${getPagePartsQuery('topicalPage')},
       "elements": ${createElementsQuery(code, elementNames, locale)},
       "riskLevel": *[_type == 'riskLevelNational']{
          "level": riskLevel,
          "dateFrom": date,
        }[0],
        "weeklyHighlight": *[_type == 'editorial'] | order(publicationDate desc) {
          title,
          publicationDate,
          slug,
          "cover": {
            ...cover,
            "asset": cover.asset->
          }
        }[0]
      }`;
    })(context);

    const highlightInfo = content.parts.pageParts
      .filter(isHighlightedItemParts)
      .find((x) => x.pageDataKind === 'topicalPageHighlights');

    return {
      content: {
        articles:
          content.parts.pageParts
            .filter(isArticleParts)
            .find((x) => x.pageDataKind === 'topicalPageArticles')?.articles ??
          null,
        highlights: highlightInfo?.highlights ?? null,
        showWeeklyHighlight: highlightInfo?.showWeeklyHighlight ?? false,
        elements: content.elements,
        weeklyHighlight: content.weeklyHighlight,
        riskLevel: content.riskLevel,
      },
    };
  };
}
