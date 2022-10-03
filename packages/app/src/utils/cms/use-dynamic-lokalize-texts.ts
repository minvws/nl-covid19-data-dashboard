import { unflatten } from 'flat';
import { useEffect, useState } from 'react';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import {
  IS_STAGING_ENV,
  mapSiteTextValuesToKeys,
} from '~/locale/use-lokalize-text';
import { fetchLokalizeTexts } from './fetch-lokalize-texts';

export const useDynamicLokalizeTexts = <T extends Record<string, unknown>>(
  initialTexts: T,
  selector: (text: SiteText) => T
) => {
  const [texts, setTexts] = useState<T>(initialTexts);
  const { dataset, locale } = useIntl();

  useEffect(() => {
    const environment = IS_STAGING_ENV ? 'production' : 'development';

    // when dataset is 'keys' we show the sanity keys instead of the sanity texts
    if (dataset === 'keys') {
      fetchLokalizeTexts(environment)
        .catch(handleSanityError)
        .then((texts) => texts[locale] as unknown as SiteText)
        .then((texts) => mapSiteTextValuesToKeys(texts))
        .then((texts) => setTexts(selector(texts)));
    }
    // when locale is set to 'en' with the debug toggle we fetch the en texts and show them instead of the default nl texts
    else if (locale === 'en') {
      fetchLokalizeTexts(environment)
        .catch(handleSanityError)
        .then((texts) => texts[locale] as unknown as SiteText)
        .then((texts): SiteText => {
          return unflatten(texts, { object: true });
        })
        .then((texts) => setTexts(selector(texts)));
    } else {
      setTexts(initialTexts);
    }
  }, [initialTexts, dataset, locale, selector]);

  return texts;
};

const handleSanityError = (error: any) => {
  throw new Error(
    `[${useDynamicLokalizeTexts.name}] Error while fetching Sanity content: "${error}"`
  );
};
