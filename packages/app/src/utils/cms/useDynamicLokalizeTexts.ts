import { useMemo, useState } from 'react';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { fetchLokalizeTexts } from './fetchContent';

export const useDynamicLokalizeTexts = <T extends Record<string, any>>(
  initialTexts: T,
  selector: (text: SiteText) => T
) => {
  return initialTexts;
};

export const useDynamicLokalizeTexts1 = <T extends Record<string, any>>(
  initialTexts: T,
  selector: (text: SiteText) => T
) => {
  const [texts, setTexts] = useState<T>(initialTexts);
  const [isFetching, setIsFetching] = useState(false);

  const { dataset, locale } = useIntl();

  return useMemo(() => {
    console.log('dataset', dataset);

    if (dataset === 'keys' && !isFetching) {
      setIsFetching(true);
      fetchLokalizeTexts(dataset)
        .catch((err) => {
          throw new Error(`Error while fetching Sanity content: "${err}"`);
        })
        .then((texts) => texts[locale] as unknown as SiteText)
        .then((nlTexts) => setTexts(selector(nlTexts)))
        .then(() => setIsFetching(false));
    }

    return texts;
  }, [dataset, locale, selector, texts, isFetching]);
};
