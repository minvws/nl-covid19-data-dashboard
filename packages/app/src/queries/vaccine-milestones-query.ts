import { GetStaticPropsContext } from 'next';

export function getVaccineMilestonesQuery(context: GetStaticPropsContext) {
  const { locale = 'nl' } = context;

  return `
  *[_type=='vaccinationsPage']{
    "title": title.${locale},
    "description": description.${locale},
    "milestones": [...milestones | order(date)[] {
      "title": title.${locale},
      date,
    }],
    "expectedMilestones": [...expected[]{
      "item": ${locale}
    }] 
  }[0]
`;
}
