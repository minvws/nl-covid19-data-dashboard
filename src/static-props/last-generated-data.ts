import fs from 'fs';
import path from 'path';

export interface ILastGeneratedData {
  lastGenerated: string;
}

interface IProps {
  props: ILastGeneratedData;
}

/*
 * getLastGeneratedData loads the data for pages where no other data is loaded.
 * In most cases you can fetch either NL.json, regional data or gemeente data to get
 * last generated values that way. In other words, use this for skeleton pages where no
 * other data has been fetched yet.
 * It needs to be used as the Next.js `getStaticProps` function.
 *
 * Example:
 * ```ts
 * Regio.getLayout = getSafetyRegionLayout();
 *
 * export const getStaticProps = getLastGeneratedData();
 *
 * export default Regio;
 * ```
 *
 * The `ILastGeneratedData` should be used in conjuction with `FCWithLayout`
 *
 * Example:
 * ```ts
 * const Regio: FCWithLayout<ILastGeneratedData> = props => {
 *   // ...
 * }
 * ```
 */
export async function getLastGeneratedData(): Promise<IProps> {
  let nlData;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    nlData = JSON.parse(fileContents);
  } else {
    const res = await fetch(
      'https://coronadashboard.rijksoverheid.nl/json/NL.json'
    );
    nlData = await res.json();
  }

  const lastGenerated = nlData.last_generated;

  return {
    props: {
      lastGenerated,
    },
  };
}
