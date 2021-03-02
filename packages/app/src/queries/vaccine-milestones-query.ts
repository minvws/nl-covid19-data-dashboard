import { targetLanguage } from '~/locale';

export const vaccineMilestonesQuery = `
  *[_type=='vaccinationsPage']{
    "title": title.${targetLanguage},
    "description": description.${targetLanguage},
    "milestones": [...milestones | order(date)[] {
      "title": title.${targetLanguage},
      date,
    }],
    "expectedMilestones": [...expected[]{
      "item": ${targetLanguage}
    }] 
  }[0]
`;
