import fs from 'fs';
import path from 'path';

import { Regionaal } from '~/types/data.d';

import safetyRegions from '~/data/index';

export interface ISafetyRegionData {
  data: Regionaal;
  safetyRegionName: string;
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
  return function ({ params }: IParams): IProps {
    const { code } = params;

    // get data for the page
    const filePath = path.join(process.cwd(), 'public', 'json', `${code}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as Regionaal;

    const lastGenerated = data.last_generated;

    const safetyRegionName =
      safetyRegions.find((r) => r.code === code)?.name || '';

    return {
      props: {
        data,
        safetyRegionName,
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
