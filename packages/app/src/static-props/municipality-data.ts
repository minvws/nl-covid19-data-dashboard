import fs from 'fs';
import path from 'path';
import municipalities from '~/data/municipalSearchData';
import { TALLLanguages } from '~/locale';
import { Municipal } from '~/types/data.d';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { sortMunicipalTimeSeriesInDataInPlace } from './data-sorting';

export interface IMunicipalityData {
  data: Municipal;
  lastGenerated: string;
  municipalityName: string;
  text: TALLLanguages;
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

/**
 * getMunicipalityData loads the data for /gemeente pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PositivelyTestedPeople.getLayout = getMunicipalityLayout();
 *
 * export const getStaticProps = getMunicipalityData();
 *
 * export default PositivelyTestedPeople;
 * ```
 *
 * The `IMunicipalityData` should be used in conjunction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PositivelyTestedPeople: FCWithLayout<IMunicipalityData> = props => {
 *   // ...
 * }
 * ```
 */
export function getMunicipalityData() {
  return async function ({ params }: IParams): Promise<IProps> {
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
      },
    };
  };
}

/**
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
