import { GetStaticPropsContext } from 'next';

export function getVaccineMilestonesQuery() {
  const locale = 'nl';
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
