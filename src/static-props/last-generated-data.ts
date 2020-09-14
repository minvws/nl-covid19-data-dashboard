import fs from 'fs';
import path from 'path';

export interface ILastGeneratedData {
  lastGenerated: string;
}

interface IProps {
  props: ILastGeneratedData;
}

/*
 * getNlData loads the data for /landelijk pages.
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
    console.log('generating getLastGeneratedData');
    const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lastGenerated = JSON.parse(fileContents).last_generated;

    console.log({ lastGenerated });
    return {
      props: {
        lastGenerated,
      },
    };
  };
}
