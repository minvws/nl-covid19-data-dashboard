import path from 'path';
import safetyRegions from '~/data/index';
import { Regionaal, Regions } from '~/types/data.d';
import { sortRegionalTimeSeriesInDataInPlace } from './data-sorting';
import { loadJsonFromFile } from './utils/load-json-from-file';

export interface ISafetyRegionData {
  data: Regionaal;
  code: string;
  safetyRegionName: string;
  lastGenerated: string;
  escalationLevel: Regions['escalation_levels'][number];
}

interface IProps {
  props: ISafetyRegionData;
}

interface IPaths {
  paths: Array<{ params: { code: string } }>;
  fallback: boolean;
}

interface IParams {
  params: {
    code: string;
  };
}

/*
 * getSafetyRegionData loads the data for /veiligheidsregio pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PostivelyTestedPeople.getLayout = getSafetyRegionLayout();
 *
 * export const getStaticProps = getSafetyRegionData();
 *
 * export default PostivelyTestedPeople;
 * ```
 *
 * The `ISafetyRegionData` should be used in conjuction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = props => {
 *   // ...
 * }
 * ```
 */
export function getSafetyRegionData() {
  return function ({ params }: IParams): IProps {
    const { code } = params;

    const publicJsonPath = path.join(process.cwd(), 'public', 'json');

    // get data for the page
    const data = loadJsonFromFile<Regionaal>(
      path.join(publicJsonPath, `${code}.json`)
    );

    // get the regions file and extract the escalation level for this region from it
    const regionsData = loadJsonFromFile<Regions>(
      path.join(publicJsonPath, `REGIONS.json`)
    );

    const escalationLevelInfo =
      regionsData.escalation_levels.find((item) => item.vrcode === code) ??
      regionsData.escalation_levels[0];

    sortRegionalTimeSeriesInDataInPlace(data);

    const lastGenerated = data.last_generated;

    const safetyRegionName =
      safetyRegions.find((r) => r.code === code)?.name || '';

    return {
      props: {
        data,
        code,
        safetyRegionName,
        lastGenerated,
        escalationLevel: escalationLevelInfo,
      },
    };
  };
}

/*
 * getSafetyRegionPaths creates an array of all the allowed
 * `/veiligheidsregio/[code]` routes. This should be used
 * together with `getSafetyRegionData`.
 */
export function getSafetyRegionPaths(): () => IPaths {
  return function () {
    const filteredRegions = safetyRegions.filter(
      (region) => region.code.indexOf('VR') === 0
    );
    const paths = filteredRegions.map((region) => ({
      params: { code: region.code },
    }));

    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
  };
}
