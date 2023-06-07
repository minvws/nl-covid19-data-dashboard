import { getClient } from '~/lib/sanity';
import { getNotFoundPageQuery } from '~/queries/get-not-found-page-query';
import { NotFoundPageConfiguration } from './types';

const determinePageTypeFromUrl = (url: string) => {
  const levelsToPageTypeMapping: { [key: string]: string } = { landelijk: 'nl', gemeente: 'gm', artikelen: 'article', general: 'general', verantwoording: 'dataExplained' };
  const pageType = levelsToPageTypeMapping[Object.keys(levelsToPageTypeMapping).find((key) => url.includes(`/${key}`)) ?? 'general'];

  return pageType;
};

/**
 * @function getNotFoundPageData
 * @description Fetches the data for a given page type from Sanity and adds additional properties to the page configuration.
 * @param url - The current request URL.
 * @param locale - The selected locale.
 * @returns {Promise<NotFoundPageConfiguration> | null} - Returns the page configuration if found, otherwise null.
 */
export const getNotFoundPageData = async (url: string, locale: string) => {
  const pageType = url ? determinePageTypeFromUrl(url) : 'general';
  const query = getNotFoundPageQuery(locale, pageType);
  const client = await getClient();
  const notFoundPageConfiguration: NotFoundPageConfiguration = await client.fetch(query);

  if (!notFoundPageConfiguration) return null;

  notFoundPageConfiguration.isGmPage = pageType === 'gm';
  notFoundPageConfiguration.isGeneralPage = pageType === 'general';

  return notFoundPageConfiguration;
};
