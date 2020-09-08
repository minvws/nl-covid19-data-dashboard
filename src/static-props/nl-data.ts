import fs from 'fs';
import path from 'path';

import { National } from 'types/data';

export interface INationalData {
  data: National;
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

    return {
      props: {
        data: JSON.parse(fileContents),
      },
    };
  };
}
