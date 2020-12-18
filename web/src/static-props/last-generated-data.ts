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
export default function getLastGeneratedData(): () => IProps {
  return function () {
    const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lastGenerated = JSON.parse(fileContents).last_generated;

    return {
      props: {
        lastGenerated,
      },
    };
  };
}
