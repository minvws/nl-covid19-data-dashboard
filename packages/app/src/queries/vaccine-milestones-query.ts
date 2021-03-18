export function getVaccineMilestonesQuery() {
  //@TODO
  // CONTEXT IS NOT PASSED TO THIS GETTER. FIGURE OUT HOW TO SOLVE THIS!
  const locale = process.env.NEXT_PUBLIC_LOCALE;

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
