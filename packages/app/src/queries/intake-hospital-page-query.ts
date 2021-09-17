import { GetStaticPropsContext } from 'next';

export function getIntakeHospitalPageQuery(context: GetStaticPropsContext) {
  const { locale } = context;

  return `
  *[_type=='intensiveCarePage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
