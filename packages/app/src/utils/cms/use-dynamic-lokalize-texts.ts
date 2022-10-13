import { useEffect, useState } from 'react';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { IS_STAGING_ENV, mapSiteTextValuesToKeys } from '~/locale/use-lokalize-text';
import { fetchLokalizeTexts } from './fetch-lokalize-texts';

export const useDynamicLokalizeTexts = <T extends Record<string, unknown>>(initialTexts: T, selector: (text: SiteText) => T) => {
  const [texts, setTexts] = useState<T>(initialTexts);
  const { dataset, locale } = useIntl();

  useEffect(() => {
    if (dataset === 'keys') {
      fetchLokalizeTexts(IS_STAGING_ENV ? 'production' : 'development')
        .catch((err) => {
          throw new Error(`[${useDynamicLokalizeTexts.name}] Error while fetching Sanity content: "${err}"`);
        })
        .then((texts) => texts[locale] as unknown as SiteText)
        .then((texts) => mapSiteTextValuesToKeys(texts))
        .then((texts) => setTexts(selector(texts)));
    } else {
      setTexts(initialTexts);
    }
  }, [initialTexts, dataset, locale, selector]);

  return texts;
};
