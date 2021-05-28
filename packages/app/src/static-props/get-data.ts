import {
  Municipal,
  Municipalities,
  National,
  Regionaal,
  Regions,
  sortTimeSeriesInDataInPlace,
} from '@corona-dashboard/common';
import set from 'lodash/set';
import { GetStaticPropsContext } from 'next';
import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';
import {
  gmPageMetricNames,
  GmPageMetricNames,
} from '~/domain/layout/municipality-layout';
import {
  NlPageMetricNames,
  nlPageMetricNames,
} from '~/domain/layout/national-layout';
import {
  vrPageMetricNames,
  VrRegionPageMetricNames,
} from '~/domain/layout/safety-region-layout';
import { getClient, localize } from '~/lib/sanity';
import { loadJsonFromDataFile } from './utils/load-json-from-data-file';

/**
 * Usage:
 *
 *     export const getStaticProps = createGetStaticProps(
 *       getLastGeneratedDate,
 *       selectVrPageMetricData('metric_name1', 'metric_name2'),
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
    const rawContent = await (await getClient()).fetch<T>(query);

    const { locale } = context;
    const content = localize(rawContent ?? {}, [locale ?? 'nl']) as T;

    return { content };
  };
}

/**
 * This method returns all the national data that is required by the sidebar,
 * optional extra metric property names can be added as separate arguments which will
 * be added to the output
 *
 */
export function selectNlPageMetricData<
  T extends keyof National = NlPageMetricNames
>(...additionalMetrics: T[]) {
  return selectNlData(...[...nlPageMetricNames, ...additionalMetrics]);
}

/**
 * This method selects only the specified metric properties from the national data
 *
 */
export function selectNlData<T extends keyof National = never>(
  ...metrics: T[]
) {
  return () => {
    const { data } = getNlData();

    const selectedNlData = metrics.reduce(
      (acc, p) => set(acc, p, data[p]),
      {} as Pick<National, T>
    );

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
 * optional extra metric property names can be added as separate arguments which will
 * be added to the output
 *
 */
export function selectVrPageMetricData<
  T extends keyof Regionaal = VrRegionPageMetricNames
>(...additionalMetrics: T[]) {
  return selectVrData(...[...vrPageMetricNames, ...additionalMetrics]);
}

/**
 * This method selects only the specified metric properties from the region data
 *
 */
export function selectVrData<T extends keyof Regionaal = never>(
  ...metrics: T[]
) {
  return (context: GetStaticPropsContext) => {
    const vrData = getVrData(context);

    const selectedVrData = metrics.reduce(
      (acc, p) => set(acc, p, vrData.data[p]),
      {} as Pick<Regionaal, T>
    );

    return { selectedVrData, safetyRegionName: vrData.safetyRegionName };
  };
}

export function getVrData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid vrcode found in context');
  }

  const data = loadAndSortVrData(code);

  const safetyRegionName = getVrName(code);

  return {
    data,
    safetyRegionName,
  };
}

export function getVrName(code: string) {
  const safetyRegion = vrData.find((x) => x.code === code);
  return safetyRegion?.name || '';
}

export function loadAndSortVrData(vrcode: string) {
  const data = loadJsonFromDataFile<Regionaal>(`${vrcode}.json`);

  sortTimeSeriesInDataInPlace(data);

  return data;
}

/**
 * This method returns all the municipal data that is required by the sidebar,
 * optional extra metric property names can be added as separate arguments which will
 * be added to the output
 *
 */
export function selectGmPageMetricData<
  T extends keyof Municipal = GmPageMetricNames
>(...additionalMetrics: T[]) {
  return selectGmData(...[...gmPageMetricNames, ...additionalMetrics]);
}

/**
 * This method selects only the specified metric properties from the municipal data
 *
 */
export function selectGmData<T extends keyof Municipal = never>(
  ...metrics: T[]
) {
  return (context: GetStaticPropsContext) => {
    const gmData = getGmData(context);

    const selectedGmData = metrics.reduce(
      (acc, p) => set(acc, p, gmData.data[p]),
      {} as Pick<Municipal, T>
    );

    return { selectedGmData, municipalityName: gmData.municipalityName };
  };
}

export function getGmData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid gmcode found in context');
  }

  const data = loadJsonFromDataFile<Municipal>(`${code}.json`);

  const municipalityName = gmData.find((x) => x.gemcode === code)?.name || '';

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
