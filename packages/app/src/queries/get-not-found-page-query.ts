export const getNotFoundPageQuery = (locale: string, pageType: string) => {
  return `// groq
    *[_type == 'notFoundPageItem' && pageType == '${pageType}' && !(_id in path('drafts.**'))]{
      ...,
      'title': title.${locale},
      'description': {
        ...description,
        'nl': [
          ...description.${locale}[]
        ]
      },
      'links': links[]->{
        'linkUrl': linkUrl,
        'linkLabel': linkLabel.${locale},
        'linkIcon': linkIcon,
      },
      'cta': {
        ...cta,
        'ctaLabel': cta.ctaLabel.${locale},
      },
      "image": {
        ...image,
        "altText": image.altText.${locale},
        "asset": {
          ...image.asset->,
        }
      }
    }[0]
  `;
};
