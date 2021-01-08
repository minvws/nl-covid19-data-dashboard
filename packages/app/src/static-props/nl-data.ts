import fs from 'fs';
import path from 'path';
import { National } from '~/types/data.d';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { ChoroplethSettings, getChoroplethData } from './choropleth-data';
import { sortNationalTimeSeriesInDataInPlace } from './data-sorting';

interface NationalPagePropsSettings<T1, T2> {
  choropleth?: ChoroplethSettings<T1, T2>;
}

export type NationalPageProps = Await<
  ReturnType<ReturnType<typeof getNationalStaticProps>>
>['props'];

export function getNationalStaticProps<T1 = undefined, T2 = undefined>(
  settings?: NationalPagePropsSettings<T1, T2>
) {
  return async () => {
    const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as National;

    const lastGenerated = data.last_generated;

    sortNationalTimeSeriesInDataInPlace(data);

    const text = parseMarkdownInLocale(
      (await import('../locale/index')).default
    );

    return {
      props: {
        data,
        text,
        lastGenerated,
        choropleth: getChoroplethData(settings?.choropleth),
      },
    };
  };
}
