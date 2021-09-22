import { GetStaticPropsContext } from 'next';
import { createElementsQuery } from './create-elements-query';

export function getTopicalPageQuery(
  context: GetStaticPropsContext & { locale: string }
) {
  const { locale } = context;

  return /* groq */ `{
    'showWeeklyHighlight': *[_type=='topicalPage']{
      showWeeklyHighlight,
    }[0].showWeeklyHighlight,
    'weeklyHighlight': *[_type == 'editorial'] | order(publicationDate desc) {
      "title":title.${locale},
      publicationDate,
      "slug": slug.current,
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0],
    'highlights': *[_type=='topicalPage']{
      showWeeklyMessage,
      highlights[]{
        "title":title.${locale},
        "category": category.${locale},
        "slug": href,
        "cover": {
          ...cover,
          "asset": cover.asset->  
        }
      }
    }[0].highlights,
    'articles': *[_type == 'topicalPage']{
      articles[]->{
        "title":title.${locale},
        "slug": slug.current,
        "cover": {
          ...cover,
          "asset": cover.asset->
        }
      }
    }[0].articles,
    'elements': ${createElementsQuery(
      'nl',
      ['tested_overall', 'hospital_nice', 'vaccine_administered_total'],
      locale
    )}
  }`;
}
