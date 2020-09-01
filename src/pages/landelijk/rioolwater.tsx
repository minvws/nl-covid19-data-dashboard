import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import {
  getNationalLayout,
  NationalLayoutProps,
} from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';
import { ContentHeader } from 'components/layout/Content';

import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import { RioolwaterMetingen } from 'types/data';

const text: typeof siteText.rioolwater_metingen = siteText.rioolwater_metingen;

export function SewerWaterBarScale(props: { data: RioolwaterMetingen }) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
      value={Number(data.last_value.average)}
      id="rioolwater_metingen"
      rangeKey="average"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const SewerWater: FCWithLayout<NationalLayoutProps> = ({ data: state }) => {
  const data: RioolwaterMetingen = state.rioolwater_metingen;

  return (
    <>
      <ContentHeader
        category="Overige indicatoren"
        title={text.titel}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.week_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <SewerWaterBarScale data={data} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {data?.values && (
          <LineChart
            timeframeOptions={['all', '5weeks']}
            values={data.values.map((value) => ({
              value: Number(value.average),
              date: value.week_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<NationalLayoutProps> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: JSON.parse(fileContents),
    },
  };
};

export default SewerWater;
