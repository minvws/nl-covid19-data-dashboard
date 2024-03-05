interface DataSource {
  href: string;
  text: string;
}

export const getMunicipalityJsonLink = (dataSourceHref: string, dataSourceText: string): DataSource => {
  return { href: dataSourceHref, text: dataSourceText };
};
