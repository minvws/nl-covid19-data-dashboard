import { GetStaticPropsContext } from 'next';

export function getVaccineMilestonesQuery(context: GetStaticPropsContext) {
  //@TODO
  // CONTEXT IS NOT PASSED TO THIS GETTER. FIGURE OUT HOW TO SOLVE THIS!
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
