import fs from 'fs';
import path from 'path';

import { Municipal } from '~/types/data.d';

import municipalities from '~/data/gemeente_veiligheidsregio.json';

export interface IMunicipalityData {
  data: Municipal;
  lastGenerated: string;
  municipalityName: string;
}

interface IPaths {
  paths: Array<{ params: { code: string } }>;
  fallback: boolean;
}

interface IProps {
  props: IMunicipalityData;
}

interface IParams {
  params: {
    code: string;
  };
}

/*
 * getMunicipalityData loads the data for /gemeente pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PostivelyTestedPeople.getLayout = getMunicipalityLayout();
 *
 * export const getStaticProps = getMunicipalityData();
 *
 * export default PostivelyTestedPeople;
 * ```
 *
 * The `IMunicipalityData` should be used in conjuction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PostivelyTestedPeople: FCWithLayout<IMunicipalityData> = props => {
 *   // ...
 * }
 * ```
 */
export function getMunicipalityData() {
  return function ({ params }: IParams): IProps {
    const { code } = params;

    const filePath = path.join(process.cwd(), 'public', 'json', `${code}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const municipalityName =
      municipalities.find((r) => r.gemcode === code)?.name || '';
    const lastGenerated = data.last_generated;

    return {
      props: {
        data,
        municipalityName,
        lastGenerated,
      },
    };
  };
}

/*
 * getMunicipalityPaths creates an array of all the allowed
 * `/gemeente/[code]` routes. This should be used
 * together with `getMunicipalityData`.
 */
export function getMunicipalityPaths(): () => IPaths {
  return function () {
    const paths = municipalities.map((municipality) => ({
      params: { code: municipality.gemcode },
    }));

    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
  };
}
