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
import municipalities from '~/data/municipalSearchData';
import { client, localize } from '~/lib/sanity';
import { targetLanguage } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { loadJsonFromDataFile } from './utils/load-json-from-data-file';
import * as allMessages from '~/messages';
import { HospitalPageBlockKeys, HospitalPageStringKeys } from '~/messages';
import { cloneDeep } from 'lodash';

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

    const content = localize(rawContent ?? {}, [targetLanguage, 'nl']) as T;

    return { content };
  };
}

export async function getText() {
  return {
    text: parseMarkdownInLocale((await import('../locale/index')).default),
  };
}

export function createGetMessages(pageName: string[]) {
  return async (context: GetStaticPropsContext) => {
    console.log('keyof', allMessages);

    const messages: Record<string, unknown> = {};
    pageName.forEach((pageName) => {
      messages[pageName] = {};
    });

    const bucketName = pageName[0][0].toUpperCase() + pageName[0].substr(1);

    const keys = (allMessages[
      `${bucketName}StringKeys` as string
    ] as unknown) as string[];
    const blocks = (allMessages[
      `${bucketName}BlockKeys` as string
    ] as unknown) as string[];

    console.log(keys, blocks);

    const query = `
    *[_type=="${pageName}"]{
      "messages": {
        ${keys
          .map((key: string) => {
            const safeKey = key.replace(/\:/g, '_');
            return `"${safeKey}": messages.${safeKey}.${targetLanguage}`;
          })
          .join(',')},
        ${blocks
          .map((key: string) => {
            const safeKey = key.replace(/\:/g, '_');
            // return `"${safeKey}": messages.${safeKey}.${targetLanguage}`;

            return `
            "${safeKey}": [
                ...messages.${safeKey}.${targetLanguage}[]{
                ...,
                "asset": asset->
                }
              ]`;
          })
          .join(',')}
      },
      "messageExceptions": messageExceptions[]{
        ...,
        "value": value.${targetLanguage}
      }
    }[0]
    `;

    const rawContent = await client.fetch(query);
    const content = localize(rawContent ?? {}, [targetLanguage, 'nl']);
    console.log(content.messageExceptions, context.params);

    const formattedMessages = cloneDeep(content.messages);

    if (content.messageExceptions) {
      content.messageExceptions.forEach(
        (exception: { field: string; match: string; value: string }) => {
          console.log(exception);
          if (!formattedMessages[exception.field]) {
            return;
          }
          if (exception.match === 'NL' && !context?.params?.code) {
            formattedMessages[exception.field] = exception.value;
            return;
          }
          if (
            exception.match === 'VR*' &&
            context?.params?.code &&
            (context?.params?.code as string).startsWith('VR')
          ) {
            formattedMessages[exception.field] = exception.value;
            return;
          }
          if (
            exception.match === 'GM*' &&
            context?.params?.code &&
            (context?.params?.code as string).startsWith('GM')
          ) {
            formattedMessages[exception.field] = exception.value;
            return;
          }
          if (exception.match === context?.params?.code) {
            formattedMessages[exception.field] = exception.value;
            return;
          }
        }
      );
    }

    return {
      messages: formattedMessages,
    };
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
