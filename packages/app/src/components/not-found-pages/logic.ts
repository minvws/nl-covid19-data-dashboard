import { getClient } from '~/lib/sanity';
import { getNotFoundPageQuery } from '~/queries/get-not-found-page-query';
import { NotFoundPageConfiguration } from './types';

/**
 * @function determinePageType
 * @description Returns the page type based on the request URL.
 */
const determinePageType = (url: string) => {
  const levelsToPageTypeMapping: { [key: string]: string } = { landelijk: 'nl', gemeente: 'gm', artikelen: 'article', general: 'general' };
  const pageType = levelsToPageTypeMapping[Object.keys(levelsToPageTypeMapping).find((key) => url.includes(`/${key}`)) ?? 'general'];

  return pageType;
};

/**
 * @function getNotFoundPageData
 * @description Fetches the data for a given page type from Sanity.
 */
export const getNotFoundPageData = async (url: string, locale: string) => {
  const pageType = url ? determinePageType(url) : 'general';
  const query = getNotFoundPageQuery(locale, pageType);
  const client = await getClient();
  const notFoundPageConfiguration: NotFoundPageConfiguration = await client.fetch(query);

  if (!notFoundPageConfiguration) return null;

  notFoundPageConfiguration.isGmPage = pageType === 'gm';
  notFoundPageConfiguration.isGeneralPage = pageType === 'general';

  return notFoundPageConfiguration;
};
