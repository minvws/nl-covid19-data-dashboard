export const getNotFoundPageQuery = (locale: string) => {
  return `// groq
    *[_type == 'notFoundPageItem' && !(_id in path('drafts.**'))]{
      'pageType': pageType,
      'title': title.${locale},
      'description': description.${locale},
      'links': links[]->{
        'id': _id,
        'linkUrl': linkUrl,
        'linkLabel': linkLabel.${locale},
        'linkIcon': linkIcon,
      },
      'cta': {
        'ctaLink': cta.ctaLink,
        'ctaLabel': cta.ctaLabel.${locale},
        'ctaIcon': cta.ctaIcon
      },
      "image": {
        ...image,
        "altText": image.altText.${locale},
        "asset": {
          ...image.asset->,
        }
      }
    }
  `;
};
