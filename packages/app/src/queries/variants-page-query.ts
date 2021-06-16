export function getVaccinePageQuery() {
  //@TODO We need to switch this from process.env to context as soon as we use i18n routing
  // const { locale } = context;
  const locale = process.env.NEXT_PUBLIC_LOCALE;

  return `
  *[_type=='variantsPage']{
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
