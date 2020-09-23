import { Regionaal, Regions } from '~/types/data.d';

import safetyRegions from '~/data/index';

import { readFromFSorFetch } from './utils/readFromFSorFetch';

export interface ISafetyRegionData {
  data: Regionaal;
  municipalities: Regions;
  lastGenerated: string;
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
  return async function ({ params }: IParams): Promise<IProps> {
    const { code } = params;

    const safety = readFromFSorFetch(`${code}.json`);
    const municipalities = readFromFSorFetch('MUNICIPALITIES.json');

    const values = await Promise.all([safety, municipalities]);

    const safetyRegionData: Regionaal = values[0];
    const municipalitiesData = values[1];

    const lastGenerated = safetyRegionData.last_generated;

    return {
      props: {
        data: safetyRegionData,
        municipalities: municipalitiesData,
        lastGenerated,
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
