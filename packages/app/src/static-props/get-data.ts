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
import { municipalMetricNames } from '~/domain/layout/municipality-layout';
import { nationalMetricNames } from '~/domain/layout/national-layout';
import { safetyRegionMetricNames } from '~/domain/layout/safety-region-layout';
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

export function selectDefaultNlData<
  T extends keyof National = typeof nationalMetricNames[number]
>(
  ...additionalMetrics: T[]
): () => {
  selectedNlData: Pick<National, typeof nationalMetricNames[number] | T>;
} {
  return selectSpecificNlData(
    ...[...nationalMetricNames, ...additionalMetrics]
  );
}

export function selectSpecificNlData<T extends keyof National>(
  ...metrics: T[]
) {
  return () => {
    const { data } = getNlData();

    const selectedNlData: Pick<National, T> = {} as Pick<National, T>;
    metrics.forEach((p) => {
      selectedNlData[p] = data[p];
    });

    return { selectedNlData };
  };
}

export function getNlData() {
  // clone data to prevent mutation of the original
  const data = JSON.parse(JSON.stringify(json.nl)) as National;

  sortTimeSeriesInDataInPlace(data);

  return { data };
}

/**
 * This method returns all the region data that is required by the sidebar,
 * optional extra metric property names can be added as arguments which will
 * be added to the output
 *
 */
export function selectDefaultVrData<
  T extends keyof Regionaal = typeof safetyRegionMetricNames[number]
>(
  ...additionalMetrics: T[]
): (
  context: GetStaticPropsContext
) => {
  selectedVrData: Pick<Regionaal, typeof safetyRegionMetricNames[number] | T>;
  safetyRegionName: string;
} {
  return selectSpecificVrData(
    ...[...safetyRegionMetricNames, ...additionalMetrics]
  );
}

/**
 * This method selects only the specified meric properties from the region data
 *
 */
export function selectSpecificVrData<T extends keyof Regionaal>(
  ...metrics: T[]
) {
  return (context: GetStaticPropsContext) => {
    const vrData = getVrData(context);

    const selectedVrData = {} as Pick<Regionaal, T>;
    metrics.forEach((p) => {
      selectedVrData[p] = vrData.data[p];
    });

    return { selectedVrData, safetyRegionName: vrData.safetyRegionName };
  };
}

export function getVrData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid vrcode found in context');
  }

  const data = loadJsonFromDataFile<Regionaal>(`${code}.json`);

  sortTimeSeriesInDataInPlace(data);

  const safetyRegion = safetyRegions.find((r) => r.code === code);

  return {
    data,
    safetyRegionName: safetyRegion?.name || '',
  };
}

export function selectDefaultGmData<
  T extends keyof Municipal = typeof municipalMetricNames[number]
>(
  ...additionalMetrics: T[]
): (
  context: GetStaticPropsContext
) => {
  selectedGmData: Pick<Municipal, typeof municipalMetricNames[number]> | T;
  municipalityName: string;
} {
  return selectSpecificGmData(
    ...[...municipalMetricNames, ...additionalMetrics]
  );
}

export function selectSpecificGmData<T extends keyof Municipal>(
  ...metrics: T[]
) {
  return (context: GetStaticPropsContext) => {
    const gmData = getGmData(context);

    const selectedGmData: Pick<Municipal, T> = {} as Pick<Municipal, T>;
    metrics.forEach((p) => {
      selectedGmData[p] = gmData.data[p];
    });

    return { selectedGmData, municipalityName: gmData.municipalityName };
  };
}

export function getGmData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid gmcode found in context');
  }

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
