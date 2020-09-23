import fs from 'fs';
import path from 'path';

import { Regionaal } from '~/types/data.d';

import safetyRegions from '~/data/index';

export interface ISafetyRegionData {
  data: Regionaal;
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

    let safetyRegionData: Regionaal;

    const filePath = path.join(process.cwd(), 'public', 'json', `${code}.json`);

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      safetyRegionData = JSON.parse(fileContents);
    } else {
      if (process.env.NODE_ENV === 'development') {
        const res = await fetch(
          `https://coronadashboard.rijksoverheid.nl/json/${code}.json`
        );
        safetyRegionData = await res.json();
      } else {
        console.error(
          'You are running a production build without having the files available locally. To prevent a DoS attack on the production server your build will now fail. To resolve this, get a copy of the local data on your machine in /public/json/'
        );
        process.exit(1);
      }
    }

    // get data for the page

    const lastGenerated = safetyRegionData.last_generated;

    return {
      props: {
        data: safetyRegionData,
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
