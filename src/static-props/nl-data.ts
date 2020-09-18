import fs from 'fs';
import path from 'path';

import { National } from 'types/data.d';

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
export default function getNlData(): () => IProps {
  return function () {
    const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as National;

    const lastGenerated = data.last_generated;

    return {
      props: {
        data,
        lastGenerated,
      },
    };
  };
}
