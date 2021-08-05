import { GetStaticPropsContext } from 'next';

export function getVariantsPageQuery(context: GetStaticPropsContext) {
  const { locale = 'nl' } = context;

  return `
  *[_type=='variantsPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
