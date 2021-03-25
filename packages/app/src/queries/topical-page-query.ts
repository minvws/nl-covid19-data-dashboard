import { GetStaticPropsContext } from 'next';

export function getTopicalPageQuery(_context: GetStaticPropsContext) {
  //@TODO We need to switch this from process.env to context as soon as we use i18n routing
  // const { locale } = context;
  const locale = process.env.NEXT_PUBLIC_LOCALE;

  return `{
    // Retrieve the latest 3 articles with the highlighted article filtered out:
    'articles': *[_type == 'article' && !(_id == *[_type == 'topicalPage']{"i":highlightedArticle->{_id}}[0].i._id)] | order(publicationDate desc) {
      "title":title.${locale},
      slug,
      "summary":summary.${locale},
      "category":category.${locale},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0..2],
    'editorial': *[_type == 'editorial'] | order(publicationDate desc) {
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
        "label":label.nl,
        href,
        "cover": {
          ...cover,
          "asset": cover.asset->  
        }
      }
    }[0].highlights
  }`;
}
