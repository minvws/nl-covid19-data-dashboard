import { readFromFSorFetch } from './utils/readFromFSorFetch';

import { National } from '~/types/data.d';

export interface INationalData {
  data: National;
  lastGenerated: string;
  text?: any;
}

interface IProps {
  props: INationalData;
}

/*
 * getNlData loads the data for /landelijk pages.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * PostivelyTestedPeople.getLayout = getNationalLayout();
 *
 * export const getStaticProps = getNlData();
 *
 * export default PostivelyTestedPeople;
 * ```
 *
 * The `INationalData` should be used in conjuction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const PostivelyTestedPeople: FCWithLayout<INationalData> = props => {
 *   // ...
 * }
 * ```
 */
export async function getNlData(): Promise<IProps> {
  const NL = readFromFSorFetch('NL.json');

  const values = await Promise.all([NL]);

  const nlData: National = values[0];
  const lastGenerated = nlData.last_generated;

  return {
    props: {
      data: nlData,
      lastGenerated,
    },
  };
}
