import { targetLanguage } from '~/locale';

export const topicalPageQuery = `{
    // Retrieve the latest 3 articles with the highlighted article filtered out:
    'articles': *[_type == 'article' && !(_id == *[_type == 'topicalPage']{"i":highlightedArticle->{_id}}[0].i._id)] | order(publicationDate desc) {
      "title":title.${targetLanguage},
      slug,
      "summary":summary.${targetLanguage},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0..2],
    'editorial': *[_type == 'editorial'] | order(publicationDate desc) {
      "title":title.${targetLanguage},
      slug,
      "summary":summary.${targetLanguage},
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }[0],
    "highlight": *[_type=='topicalPage'] {
      "title":title.${targetLanguage},
      "summary":summary.${targetLanguage},
      "link": {
        "label":label.${targetLanguage},
        href
      },
      "cover": {
        ...cover,
        "asset": cover.asset->  
      }
    }[0]
  }`;
