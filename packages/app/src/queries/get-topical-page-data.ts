import { MetricName } from '@corona-dashboard/common';
import { GetStaticPropsContext } from 'next';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { WeeklyHighlightProps } from '~/domain/topical/highlights-tile';
import { createGetContent } from '~/static-props/get-data';
import {
  ArticleParts,
  HighlightedItemParts,
  PagePartQueryResult,
} from '~/types/cms';
import { ElementsQueryResult, getElementsQuery } from './get-elements-query';
import {
  getArticleParts,
  getHighlightedItemParts,
  getPagePartsQuery,
} from './get-page-parts-query';

export function getTopicalPageData(
  code: 'nl' | 'vr' | 'gm',
  elementNames: MetricName[]
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
       "elements": ${getElementsQuery(code, elementNames, locale)},
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

    const highlightInfo = getHighlightedItemParts(
      content.parts.pageParts,
      'topicalPageHighlights'
    );

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'topicalPageArticles'
        ),
        highlights: highlightInfo?.highlights ?? null,
        showWeeklyHighlight: highlightInfo?.showWeeklyHighlight ?? false,
        elements: content.elements,
        weeklyHighlight: content.weeklyHighlight,
        riskLevel: content.riskLevel,
      },
    };
  };
}
