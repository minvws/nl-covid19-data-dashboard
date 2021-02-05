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
    "highlight":*[_type=='topicalPage']{
      isArticle,
      isArticle == true => {
        "article":highlightedArticle->{
          "title":title.${targetLanguage},
           slug,
           "summary":summary.nl,
           "cover": {
              ...cover,
            "asset": cover.asset->
          }
        }
      },
      isArticle == false => {
        "custom": {
          "title":title.${targetLanguage},
          "summary":summary.${targetLanguage},
          "cover": {
            ...cover,
          "asset": cover.asset->,
          href  
          }
        }
      }
    }[0]
  }`;
