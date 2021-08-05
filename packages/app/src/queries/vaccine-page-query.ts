export function getVaccinePageQuery(locale: string) {
  return `
  *[_type=='vaccinationsPage']{
    "pageDescription": pageDescription.${locale},
    "usefulLinks": [...usefulLinks[]{
      "title": title.${locale},
      "category": category.${locale},
      "href": href,
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }],
    "linksTitle": linksTitle.${locale},
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
