import { GetStaticPropsContext } from 'next';

export function getInPositiveTestsQuery(context: GetStaticPropsContext) {
  const { locale = 'nl' } = context;

  return `
  *[_type=='in_positiveTestsPage']{
    "usefulLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
