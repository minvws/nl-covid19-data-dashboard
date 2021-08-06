import { GetStaticPropsContext } from 'next';

export function getVariantsPageQuery(context: GetStaticPropsContext) {
  const { locale } = context;

  return `
  *[_type=='variantsPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
