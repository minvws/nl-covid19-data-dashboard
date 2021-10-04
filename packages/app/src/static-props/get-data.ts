import {
  assert,
  Gm,
  GmCollection,
  In,
  InCollection,
  Nl,
  sortTimeSeriesInDataInPlace,
  Vr,
  VrCollection,
} from '@corona-dashboard/common';
import { SanityClient } from '@sanity/client';
import { get } from 'lodash';
import set from 'lodash/set';
import { GetStaticPropsContext } from 'next';
import { isDefined } from 'ts-is-present';
import type { F, O, S, U } from 'ts-toolbelt';
import { AsyncWalkBuilder } from 'walkjs';
import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';
import { CountryCode } from '~/domain/international/multi-select-countries';
import { getClient, localize } from '~/lib/sanity';
import { initializeFeatureFlaggedData } from './feature-flags/initialize-feature-flagged-data';
import { loadJsonFromDataFile } from './utils/load-json-from-data-file';
import { getCoveragePerAgeGroupLatestValues } from './vaccinations/get-coverage-per-age-group-latest-values';

// This type takes an object and merges unions that sit at its keys into a single object.
// Only has support for one level deep.
type UnionDeepMerge<T extends Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends object ? U.Merge<T[K]> : T[K];
};

/**
 * This typing does, from the inside out:
 * 1. Split string T at the '.' to get the path to the property.
 * 2. Pick the property path from the data object
 * 3. Merge picked data object union into a single object
 * 4. Merge nested properties unions
 */
type DataShape<T extends string, D extends Nl | Vr | Gm> = UnionDeepMerge<
  U.Merge<O.P.Pick<D, S.Split<T, '.'>>>
>;

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
  nl: initializeFeatureFlaggedData<Nl>(
    loadJsonFromDataFile<Nl>('NL.json'),
    'nl'
  ),
  vrCollection: initializeFeatureFlaggedData<VrCollection>(
    loadJsonFromDataFile<VrCollection>('VR_COLLECTION.json'),
    'vr_collection'
  ),
  gmCollection: initializeFeatureFlaggedData<GmCollection>(
    loadJsonFromDataFile<GmCollection>('GM_COLLECTION.json'),
    'gm_collection'
  ),
  inCollection: initializeFeatureFlaggedData<InCollection>(
    loadJsonFromDataFile<InCollection>('IN_COLLECTION.json', undefined, true),
    'in_collection'
  ),
};

export function getLastGeneratedDate() {
  return {
    lastGenerated: json.nl.last_generated,
  };
}

export function createGetContent<T>(
  queryOrQueryGetter:
    | string
    | ((context: GetStaticPropsContext & { locale: string }) => string)
) {
  return async (context: GetStaticPropsContext) => {
    const { locale = 'nl' } = context;
    const client = await getClient();
    const query =
      typeof queryOrQueryGetter === 'function'
        ? queryOrQueryGetter({ locale, ...context })
        : queryOrQueryGetter;

    const rawContent = (await client.fetch<T>(query)) ?? {};

    // this function call will mutate `rawContent`
    await replaceReferencesInContent(rawContent, client);

    const content = localize(rawContent, [locale]) as T;
    return { content };
  };
}

/**
 * This function will mutate an object which is a reference to another document.
 * The reference-object's keys will be deleted and all reference document-keys
 * will be added.
 * eg:
 * { _type: 'reference', _ref: 'abc' }
 * becomes:
 * { _type: 'document', id: 'abc', title: 'foo', body: 'bar' }
 */
async function replaceReferencesInContent(
  input: unknown,
  client: SanityClient,
  resolvedIds: string[] = []
) {
  await new AsyncWalkBuilder()
    .withGlobalFilter((x) => x.val?._type === 'reference')
    .withSimpleCallback(async (node) => {
      const refId = node.val._ref;

      assert(typeof refId === 'string', 'node.val._ref is not set');

      if (resolvedIds.includes(refId)) {
        const ids = `[${resolvedIds.concat(refId).join(',')}]`;
        throw new Error(
          `Ran into an infinite loop of references, please investigate the following sanity document order: ${ids}`
        );
      }

      const doc = await client.fetch(`*[_id == '${refId}']{...}[0]`);

      await replaceReferencesInContent(doc, client, resolvedIds.concat(refId));

      /**
       * Here we'll mutate the original reference object by clearing the
       * existing keys and adding all keys of the reference itself.
       */
      Object.keys(node.val).forEach((key) => delete node.val[key]);
      Object.keys(doc).forEach((key) => (node.val[key] = doc[key]));
    })
    .walk(input);
}

/**
 * This method selects the specified metric properties from the national data
 *
 */
export function selectNlData<
  T extends keyof Nl | F.AutoPath<Nl, keyof Nl, '.'>
>(...metrics: T[]) {
  return () => {
    const { data } = getNlData();

    /**
     * Instead of getting the full timeseries we are getting the latest value only per age group.
     */
    if (isDefined(data.vaccine_coverage_per_age_group)) {
      data.vaccine_coverage_per_age_group.values =
        getCoveragePerAgeGroupLatestValues(
          data.vaccine_coverage_per_age_group.values
        );
    }

    const selectedNlData = metrics.reduce(
      (acc, p) =>
        set(
          acc,
          p,
          /**
           * convert `undefined` values to `null` because nextjs cannot pass
           * undefined values via initial props.
           */
          get(data, p) ?? null
        ),

      {} as DataShape<T, Nl>
    );

    return { selectedNlData };
  };
}

export function getNlData() {
  // clone data to prevent mutation of the original
  const data = JSON.parse(JSON.stringify(json.nl)) as Nl;

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return { data };
}

/**
 * This method selects the specified metric properties from the region data
 *
 */
export function selectVrData<
  T extends keyof Vr | F.AutoPath<Vr, keyof Vr, '.'>
>(...metrics: T[]) {
  return (context: GetStaticPropsContext) => {
    const { data, vrName } = getVrData(context);

    const selectedVrData = metrics.reduce(
      (acc, p) => set(acc, p, get(data, p) ?? null),
      {} as DataShape<T, Vr>
    );

    return { selectedVrData, vrName };
  };
}

function getVrData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid vrcode found in context');
  }

  const data = loadAndSortVrData(code);

  const vrName = getVrName(code);

  return {
    data,
    vrName,
  };
}

export function getVrName(code: string) {
  const vr = vrData.find((x) => x.code === code);
  return vr?.name || '';
}

export function loadAndSortVrData(vrcode: string) {
  const data = initializeFeatureFlaggedData<Vr>(
    loadJsonFromDataFile<Vr>(`${vrcode}.json`),
    'vr'
  );

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return data;
}

/**
 * This method selects the specified metric properties from the municipal data
 *
 */
export function selectGmData<
  T extends keyof Gm | F.AutoPath<Gm, keyof Gm, '.'>
>(...metrics: T[]) {
  return (context: GetStaticPropsContext) => {
    const gmData = getGmData(context);

    const selectedGmData = metrics.reduce(
      (acc, p) => set(acc, p, get(gmData.data, p)),
      {} as DataShape<T, Gm>
    );

    return {
      selectedGmData,
      municipalityName: gmData.municipalityName,
    };
  };
}

function getGmData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid gmcode found in context');
  }

  const data = initializeFeatureFlaggedData<Gm>(
    loadJsonFromDataFile<Gm>(`${code}.json`),
    'gm'
  );

  const municipalityName = gmData.find((x) => x.gemcode === code)?.name || '';

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return { data, municipalityName };
}

const NOOP = () => null;

export function createGetChoroplethData<T1, T2, T3>(settings?: {
  vr?: (collection: VrCollection, context: GetStaticPropsContext) => T1;
  gm?: (collection: GmCollection, context: GetStaticPropsContext) => T2;
  in?: (collection: InCollection, context: GetStaticPropsContext) => T3;
}) {
  return (context: GetStaticPropsContext) => {
    const filterVr = settings?.vr ?? NOOP;
    const filterGm = settings?.gm ?? NOOP;
    const filterIn = settings?.in ?? NOOP;

    return {
      choropleth: {
        vr: filterVr(json.vrCollection, context) as T1,
        gm: filterGm(json.gmCollection, context) as T2,
        in: filterIn(json.inCollection, context) as T3,
      },
    };
  };
}

export function getInData(countryCodes: CountryCode[]) {
  return function () {
    const internationalData: Record<string, In> = {};
    countryCodes.forEach((countryCode) => {
      const data = initializeFeatureFlaggedData<In>(
        loadJsonFromDataFile<In>(`IN_${countryCode.toUpperCase()}.json`),
        'in'
      );

      sortTimeSeriesInDataInPlace(data);

      internationalData[countryCode] = data;
    });
    return { internationalData } as {
      internationalData: Record<CountryCode, In>;
    };
  };
}
