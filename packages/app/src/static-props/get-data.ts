import { ArchivedGm, ArchivedGmCollection, ArchivedNl, ArchivedVrCollection, assert, Gm, GmCollection, gmData, Nl, sortTimeSeriesInDataInPlace } from '@corona-dashboard/common';
import { SanityClient } from '@sanity/client';
import { get } from 'lodash';
import set from 'lodash/set';
import { GetStaticPropsContext } from 'next';
import { isDefined } from 'ts-is-present';
import type { F, O, S, U } from 'ts-toolbelt';
import { AsyncWalkBuilder } from 'walkjs';
import { getClient, localize } from '~/lib/sanity';
import { Languages, SiteText } from '~/locale';
import { adjustDataToLastAccurateValue, isValuesWithLastValue } from '~/utils/adjust-data-to-last-accurate-value';
import { initializeFeatureFlaggedData } from './feature-flags/initialize-feature-flagged-data';
import { loadJsonFromDataFile } from './utils/load-json-from-data-file';
import { getCoveragePerAgeGroupLatestValues } from './vaccinations/get-coverage-per-age-group-latest-values';
import { languages } from '~/locale';

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
type DataShape<T extends string, D extends Nl | Gm | ArchivedNl | ArchivedGm> = UnionDeepMerge<U.Merge<O.P.Pick<D, S.Split<T, '.'>>>>;

/**
 * Usage:
 *
 *     export const getStaticProps = createGetStaticProps(
 *       getLastGeneratedDate,
 *       selectGmData('metric_name1', 'metric_name2'),
 *       createGetChoroplethData({
 *         gm: x => ({ y: x.hospital_nice})
 *       })
 *     )({});
 */

const json = {
  nl: initializeFeatureFlaggedData<Nl>(loadJsonFromDataFile<Nl>('NL.json'), 'nl'),
  gmCollection: initializeFeatureFlaggedData<GmCollection>(loadJsonFromDataFile<GmCollection>('GM_COLLECTION.json'), 'gm_collection'),
  archived: {
    nl: initializeFeatureFlaggedData<ArchivedNl>(loadJsonFromDataFile<ArchivedNl>('NL.json', 'json/archived'), 'nl'),
    vrCollection: initializeFeatureFlaggedData<ArchivedVrCollection>(loadJsonFromDataFile<ArchivedVrCollection>('VR_COLLECTION.json', 'json/archived'), 'archived_vr_collection'),
    gmCollection: initializeFeatureFlaggedData<ArchivedGmCollection>(loadJsonFromDataFile<ArchivedGmCollection>('GM_COLLECTION.json', 'json/archived'), 'archived_gm_collection'),
  },
};

export function getLastGeneratedDate() {
  return {
    lastGenerated: json.nl.last_generated,
  };
}

/**
 * This method takes a query or a method that returns a query, executes this against Sanity
 * and subsequently resolves all of the references found in the query result.
 * Lastly it reduces the query result to the given locale, using the localize method.
 */
export function createGetContent<T>(queryOrQueryGetter: string | ((context: GetStaticPropsContext & { locale: string }) => string)) {
  return async (context: GetStaticPropsContext) => {
    const { locale = 'nl' } = context;
    const client = await getClient();
    const query = typeof queryOrQueryGetter === 'function' ? queryOrQueryGetter({ locale, ...context }) : queryOrQueryGetter;

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
async function replaceReferencesInContent(input: unknown, client: SanityClient, resolvedIds: string[] = []) {
  await new AsyncWalkBuilder()
    .withGlobalFilter((x) => x.val?._type === 'reference')
    .withSimpleCallback(async (node) => {
      const refId = node.val._ref;

      assert(typeof refId === 'string', `[${replaceReferencesInContent.name}] node.val._ref is not set`);

      if (resolvedIds.includes(refId)) {
        const ids = `[${resolvedIds.concat(refId).join(',')}]`;
        throw new Error(`Ran into an infinite loop of references, please investigate the following sanity document order: ${ids}`);
      }

      const doc = await client.fetch(`*[_id == '${refId}'][0]`);

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
 * This method selects the specified metric properties from the national data.
 * (public/json/nl.json)
 *
 */
export function selectNlData<T extends keyof Nl | F.AutoPath<Nl, keyof Nl, '.'>>(...metrics: T[]) {
  return () => {
    const { data } = getNlData();

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

    replaceInaccurateLastValue(selectedNlData);

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
 * This method selects the specified metric properties from the archived national data.
 * (public/json/archived/nl.json)
 *
 */
export function selectArchivedNlData<T extends keyof ArchivedNl | F.AutoPath<ArchivedNl, keyof ArchivedNl, '.'>>(...metrics: T[]) {
  return () => {
    const { data } = getArchivedNlData();

    /**
     * Instead of getting the full timeseries we are getting the latest value only per age group.
     */
    if (isDefined(data.vaccine_coverage_per_age_group_archived_20231004)) {
      data.vaccine_coverage_per_age_group_archived_20231004.values = getCoveragePerAgeGroupLatestValues(data.vaccine_coverage_per_age_group_archived_20231004.values);
    }

    const selectedArchivedNlData = metrics.reduce(
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

      {} as DataShape<T, ArchivedNl>
    );

    replaceInaccurateLastValue(selectedArchivedNlData);

    return { selectedArchivedNlData };
  };
}

export function getArchivedNlData() {
  // clone data to prevent mutation of the original
  const data = JSON.parse(JSON.stringify(json.archived.nl)) as ArchivedNl;

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return { data };
}

/**
 * This method selects the specified metric properties from the municipal data
 *
 */
export function selectGmData<T extends keyof Gm | F.AutoPath<Gm, keyof Gm, '.'>>(...metrics: T[]) {
  return (context: GetStaticPropsContext) => {
    const gmData = getGmData(context);

    const selectedGmData = metrics.reduce((acc, p) => set(acc, p, get(gmData.data, p)), {} as DataShape<T, Gm>);

    replaceInaccurateLastValue(selectedGmData);

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

  const data = initializeFeatureFlaggedData<Gm>(loadJsonFromDataFile<Gm>(`${code}.json`), 'gm');

  const municipalityName = gmData.find((x) => x.gemcode === code)?.name || '';

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return { data, municipalityName };
}

/**
 * This method selects the specified metric properties from the municipal data
 *
 */
export function selectArchivedGmData<T extends keyof ArchivedGm | F.AutoPath<ArchivedGm, keyof ArchivedGm, '.'>>(...metrics: T[]) {
  return (context: GetStaticPropsContext) => {
    const archivedGmData = getArchivedGmData(context);

    const selectedArchivedGmData = metrics.reduce((acc, p) => set(acc, p, get(archivedGmData.data, p)), {} as DataShape<T, ArchivedGm>);

    replaceInaccurateLastValue(selectedArchivedGmData);

    return {
      selectedArchivedGmData,
      municipalityName: archivedGmData.municipalityName,
    };
  };
}

function getArchivedGmData(context: GetStaticPropsContext) {
  const code = context.params?.code as string | undefined;

  if (!code) {
    throw Error('No valid gmcode found in context');
  }

  const data = initializeFeatureFlaggedData<ArchivedGm>(loadJsonFromDataFile<ArchivedGm>(`${code}.json`, 'json/archived'), 'gm');

  const municipalityName = gmData.find((x) => x.gemcode === code)?.name || '';

  sortTimeSeriesInDataInPlace(data, { setDatesToMiddleOfDay: true });

  return { data, municipalityName };
}

const NOOP = () => null;

export function createGetChoroplethData<T1>(settings?: { gm?: (collection: GmCollection, context: GetStaticPropsContext) => T1 }) {
  return (context: GetStaticPropsContext) => {
    const filterGm = settings?.gm ?? NOOP;

    return {
      choropleth: {
        gm: filterGm(json.gmCollection, context) as T1,
      },
    };
  };
}

export function createGetArchivedChoroplethData<T1, T2>(settings?: {
  vr?: (collection: ArchivedVrCollection, context: GetStaticPropsContext) => T1;
  gm?: (collection: ArchivedGmCollection, context: GetStaticPropsContext) => T2;
}) {
  return (context: GetStaticPropsContext) => {
    const filterVr = settings?.vr ?? NOOP;
    const filterGm = settings?.gm ?? NOOP;

    return {
      archivedChoropleth: {
        vr: filterVr(json.archived.vrCollection, context) as T1,
        gm: filterGm(json.archived.gmCollection, context) as T2,
      },
    };
  };
}

/**
 * This function makes sure that for metrics with inaccurate data for the last x
 * items, the last_value is replaced with the last accurate value. For now only
 * the rounded values are replaced to minimize the potential impact on places
 * where this is not the required behavior.
 *
 * This is meant to be a temporary fix until this is done on the backend.
 */
function replaceInaccurateLastValue(data: any) {
  const metricsInaccurateItems = ['intensive_care_nice', 'hospital_nice'];

  const inaccurateMetricProperties = ['admissions_on_date_of_admission_moving_average_rounded', 'admissions_in_the_last_7_days'];

  const metricsWithInaccurateData = metricsInaccurateItems.filter((m) => m in data) as (keyof typeof data & keyof typeof metricsInaccurateItems)[];

  metricsWithInaccurateData.forEach((m) => {
    if (isValuesWithLastValue(data[m])) {
      for (const prop in inaccurateMetricProperties) {
        data[m] = adjustDataToLastAccurateValue(data[m], inaccurateMetricProperties[prop]);
      }
    }
  });
}

/**
 * Returns a subset of a lokalize export file based on an array of keys and the
 * locale of the site to be generated.
 *
 * @param callback A function which returns a subset of a lokalize export
 * @param locale The locale of the page to be generated.
 * @returns a subset of a lokalize export file
 */
export function getLokalizeTexts<T extends object>(callback: (a: SiteText) => T, locale: keyof Languages) {
  return { pageText: callback(languages[locale]) };
}
