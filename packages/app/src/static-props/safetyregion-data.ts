import fs from 'fs';
import path from 'path';
import safetyRegions from '~/data/index';
import { Regionaal } from '~/types/data.d';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { ChoroplethSettings, getChoroplethData } from './choropleth-data';
import { sortRegionalTimeSeriesInDataInPlace } from './data-sorting';

interface SafetyRegionPagePropsSettings<T1, T2> {
  choropleth?: ChoroplethSettings<T1, T2>;
}

export type ISafetyRegionData = Await<
  ReturnType<ReturnType<typeof getSafetyRegionStaticProps>>
>['props'];

export function getSafetyRegionStaticProps<T1 = undefined, T2 = undefined>(
  settings?: SafetyRegionPagePropsSettings<T1, T2>
) {
  return async ({ params }: { params: { code: string } }) => {
    const { code } = params;

    // get data for the page
    const filePath = path.join(process.cwd(), 'public', 'json', `${code}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as Regionaal;

    sortRegionalTimeSeriesInDataInPlace(data);

    const lastGenerated = data.last_generated;

    const safetyRegionName =
      safetyRegions.find((r) => r.code === code)?.name || '';

    const text = parseMarkdownInLocale(
      (await import('../locale/index')).default
    );

    return {
      props: {
        data,
        safetyRegionName,
        lastGenerated,
        text,
        choropleth: getChoroplethData(settings?.choropleth),
      },
    };
  };
}

/**
 * getSafetyRegionPaths creates an array of all the allowed
 * `/veiligheidsregio/[code]` routes. This should be used
 * together with `getSafetyRegionStaticProps`.
 */
export function getSafetyRegionPaths() {
  return function () {
    const filteredRegions = safetyRegions.filter(
      (region) => region.code.indexOf('VR') === 0
    );
    const paths = filteredRegions.map((region) => ({
      params: { code: region.code },
    }));

    return {
      paths,
      // other routes should 404
      fallback: false,
    };
  };
}
