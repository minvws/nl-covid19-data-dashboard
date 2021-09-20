import { GetStaticPropsContext } from 'next';

export function getInPositiveTestsQuery(context: GetStaticPropsContext) {
  const { locale } = context;

  return `
  *[_type=='in_positiveTestsPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
