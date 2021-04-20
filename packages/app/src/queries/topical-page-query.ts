import { GetStaticPropsContext } from 'next';

export function getTopicalPageQuery(context: GetStaticPropsContext) {
  const { locale = 'nl' } = context;

  return `{
    // Retrieve the latest 3 articles with the highlighted article filtered out:
    'articles': *[_type == 'article' && !(_id == *[_type == 'topicalPage']{"i":highlightedArticle->{_id}}[0].i._id)] | order(publicationDate desc) {
      "title":title.${locale},
      slug,
      "summary":summary.${locale},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0..2],
    'weeklyHighlight': *[_type == 'editorial'] | order(publicationDate desc) {
      "title":title.${locale},
      slug,
      "summary":summary.${locale},
      publicationDate,
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0],
    "highlights": *[_type=='topicalPage']{
      highlights[]{
        "title":title.${locale},
        "category": category.${locale},
        "label":label.${locale},
        href,
        "cover": {
          ...cover,
          "asset": cover.asset->  
        }
      }
    }[0].highlights
  }`;
}
