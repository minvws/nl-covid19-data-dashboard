import {
  Municipal,
  Municipalities,
  National,
  Regionaal,
  Regions,
  sortTimeSeriesInDataInPlace,
} from '@corona-dashboard/common';
import { GetStaticPropsContext } from 'next';
import safetyRegions from '~/data/index';
import municipalities from '~/data/municipal-search-data';
import { client, localize } from '~/lib/sanity';
import { loadJsonFromDataFile } from './utils/load-json-from-data-file';

/**
 * Usage:
 *
 *     export const getStaticProps = createGetStaticProps(
 *       getLastGeneratedDate,
 *       getVrData,
 *       createGetChoroplethData({
 *         gm: x => ({ y: x.hospital_nice})
 *       })
 *     )({});
 */

const json = {
  nl: loadJsonFromDataFile<National>('NL.json'),
  vrCollection: loadJsonFromDataFile<Regions>('VR_COLLECTION.json'),
  gmCollection: loadJsonFromDataFile<Municipalities>('GM_COLLECTION.json'),
};

export function getLastGeneratedDate() {
  return {
    lastGenerated: json.nl.last_generated,
  };
}

export function createGetContent<T>(
  queryOrQueryGetter: string | ((context: GetStaticPropsContext) => string)
) {
  return async (context: GetStaticPropsContext) => {
    const query =
      typeof queryOrQueryGetter === 'function'
        ? queryOrQueryGetter(context)
        : queryOrQueryGetter;
    const rawContent = await client.fetch<T>(query);

    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    const content = localize(rawContent ?? {}, [locale, 'nl']) as T;

    return { content };
  };
}

export function getNlData() {
  // clone data to prevent mutation of the original
  const data = JSON.parse(JSON.stringify(json.nl)) as National;

  sortTimeSeriesInDataInPlace(data);

  return { data };
}

export function getVrData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) return null;

  const data = loadJsonFromDataFile<Regionaal>(`${code}.json`);

  sortTimeSeriesInDataInPlace(data);

  const safetyRegion = safetyRegions.find((r) => r.code === code);

  return {
    data,
    safetyRegionName: safetyRegion?.name || '',
  };
}

export function getGmData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) return null;

  const data = loadJsonFromDataFile<Municipal>(`${code}.json`);

  const municipalityName =
    municipalities.find((r) => r.gemcode === code)?.name || '';

  sortTimeSeriesInDataInPlace(data);

  return { data, municipalityName };
}

export function createGetChoroplethData<T1, T2>(settings?: {
  vr?: (collection: Regions) => T1;
  gm?: (collection: Municipalities) => T2;
}) {
  return () => {
    const filterVr = settings?.vr || (() => null);
    const filterGm = settings?.gm || (() => null);

    return {
      choropleth: {
        vr: filterVr(json.vrCollection) as T1,
        gm: filterGm(json.gmCollection) as T2,
      },
    };
  };
}
