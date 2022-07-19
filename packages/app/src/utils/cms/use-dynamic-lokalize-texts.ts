import { useEffect, useState } from 'react';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { mapSiteTextValuesToKeys } from '~/locale/use-lokalize-text';
import { fetchLokalizeTexts } from './fetch-lokalize-texts';

export const useDynamicLokalizeTexts = <T extends Record<string, unknown>>(
  initialTexts: T,
  selector: (text: SiteText) => T
) => {
  const [texts, setTexts] = useState<T>(initialTexts);
  const { dataset, locale } = useIntl();

  useEffect(() => {
    if (dataset === 'keys') {
      fetchLokalizeTexts('production')
        .catch((err) => {
          throw new Error(
            `[${useDynamicLokalizeTexts.name}] Error while fetching Sanity content: "${err}"`
          );
        })
        .then((texts) => texts[locale] as unknown as SiteText)
        .then((texts) => mapSiteTextValuesToKeys(texts))
        .then((nlTexts) => setTexts(selector(nlTexts)));
    } else {
      setTexts(initialTexts);
    }
  }, [initialTexts, dataset, locale, selector]);

  return texts;
};
