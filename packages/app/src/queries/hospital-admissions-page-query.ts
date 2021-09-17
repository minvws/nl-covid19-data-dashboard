import { GetStaticPropsContext } from 'next';

export function getHospitalAdmissionsPageQuery(context: GetStaticPropsContext) {
  const { locale } = context;

  return `
  *[_type=='hospitalPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
