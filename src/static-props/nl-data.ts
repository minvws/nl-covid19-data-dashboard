import path from 'path';
import { National } from '~/types/data.d';
import { sortNationalTimeSeriesInDataInPlace } from './data-sorting';
import { loadJsonFromFile } from './utils/load-json-from-file';

export interface NationalPageProps {
  data: National;
  lastGenerated: string;
  text?: Record<string, unknown>;
}

/*
 * getNlData loads the data for /landelijk pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PositivelyTestedPeople.getLayout = getNationalLayout;
 *
 * export const getStaticProps = getNlData
 *
 * export default PositivelyTestedPeople;
 * ```
 *
 * The `INationalData` should be used in conjunction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PositivelyTestedPeople: FCWithLayout<INationalData> = props => {
 *   // ...
 * }
 * ```
 */

export function getNationalStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');

  const data = loadJsonFromFile<National>(filePath);

  const lastGenerated = data.last_generated;

  sortNationalTimeSeriesInDataInPlace(data);

  return {
    props: {
      data,
      lastGenerated,
    },
  };
}
