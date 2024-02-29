import { replaceVariablesInText } from './replace-variables-in-text';

interface DataSource {
  href: string;
  text: string;
}

export const getMunicipalityJsonLink = (code: string, dataSource: DataSource): DataSource => {
  if (code) {
    dataSource.href = replaceVariablesInText(dataSource.href, { code: code });
  }

  return dataSource;
};
