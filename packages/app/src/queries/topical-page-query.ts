import { GetStaticPropsContext } from 'next';
import { createElementsQuery } from './create-elements-query';

export function getTopicalPageQuery(
  code: 'nl' | 'vr' | 'gm',
  elementNames: string[]
) {
  return (context: GetStaticPropsContext & { locale: string }) => {
    const { locale } = context;

    return /* groq */ `{
    // Retrieve the latest 3 articles with the highlighted article filtered out:
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
      'elements': ${createElementsQuery(code, elementNames, locale)}
    }`;
  };
}
