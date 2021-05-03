export function getVaccinePageQuery(locale: string) {
  return `
  *[_type=='vaccinationsPage']{
    "pageInfo": {
      "title": pageInfo.title.${locale},
      "description": pageInfo.description.${locale},
    },
    "pageLinks": [...pageLinks[]{
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
