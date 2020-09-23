import fs from 'fs';
import path from 'path';

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
  let nlData: National;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    nlData = JSON.parse(fileContents);
  } else {
    if (process.env.NODE_ENV === 'development') {
      const res = await fetch(
        'https://coronadashboard.rijksoverheid.nl/json/NL.json'
      );
      nlData = await res.json();
    } else {
      console.error(
        'You are running a production build without having the files available locally. To prevent a DoS attack on the production server your build will now fail. To resolve this, get a copy of the local data on your machine in /public/json/'
      );
      process.exit(1);
    }
  }

  const lastGenerated = nlData.last_generated;

  return {
    props: {
      data: nlData,
      lastGenerated,
    },
  };
}
