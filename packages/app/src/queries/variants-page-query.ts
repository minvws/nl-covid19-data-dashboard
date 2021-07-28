export function getVariantsPageQuery(locale: string) {
  return `
  *[_type=='variantsPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
