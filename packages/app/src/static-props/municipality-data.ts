import fs from 'fs';
import path from 'path';
import municipalities from '~/data/municipalSearchData';
import { Municipal } from '~/types/data.d';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { ChoroplethSettings, getChoroplethData } from './choropleth-data';
import { sortMunicipalTimeSeriesInDataInPlace } from './data-sorting';

interface MunicipalityPagePropsSettings<T1, T2> {
  choropleth?: ChoroplethSettings<T1, T2>;
}

export type ISafetyRegionData = Await<
  ReturnType<ReturnType<typeof getMunicipalityStaticProps>>
>['props'];

export type IMunicipalityData = Await<
  ReturnType<ReturnType<typeof getMunicipalityStaticProps>>
>['props'];

export function getMunicipalityStaticProps<T1 = undefined, T2 = undefined>(
  settings?: MunicipalityPagePropsSettings<T1, T2>
) {
  return async function ({ params }: { params: { code: string } }) {
    const { code } = params;

    const filePath = path.join(process.cwd(), 'public', 'json', `${code}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as Municipal;

    sortMunicipalTimeSeriesInDataInPlace(data);

    const municipalityName =
      municipalities.find((r) => r.gemcode === code)?.name || '';
    const lastGenerated = data.last_generated;

    const text = parseMarkdownInLocale(
      (await import('../locale/index')).default
    );

    return {
      props: {
        data,
        municipalityName,
        lastGenerated,
        text,
        choropleth: getChoroplethData(settings?.choropleth),
      },
    };
  };
}

/**
 * getMunicipalityPaths creates an array of all the allowed
 * `/gemeente/[code]` routes. This should be used
 * together with `getMunicipalityData`.
 */
export function getMunicipalityPaths() {
  return function () {
    const paths = municipalities.map((municipality) => ({
      params: { code: municipality.gemcode },
    }));

    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
  };
}
