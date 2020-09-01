import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import Legenda from 'components/legenda';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { AreaChart } from 'components/tiles/index';
import { ContentHeader } from 'components/layout/Content';

import Repro from 'assets/reproductiegetal.svg';

import siteText from 'locale';

import {
  ReproductionIndex as ReproductionIndexData,
  National,
} from 'types/data';

const text: typeof siteText.reproductiegetal = siteText.reproductiegetal;

export function ReproductionIndexBarScale(props: {
  data: ReproductionIndexData;
  lastKnown: ReproductionIndexData;
}) {
  const { data, lastKnown } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={2}
      screenReaderText={text.barscale_screenreader_text}
      signaalwaarde={1}
      value={lastKnown.last_value.reproduction_index_avg}
      id="repro"
      rangeKey="reproduction_index_avg"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#69c253',
          value: 1,
        },
        {
          color: '#D3A500',
          value: 1.0104,
        },
        {
          color: '#f35065',
          value: 1.125,
        },
      ]}
    />
  );
}

interface IProps {
  data: National;
}

const ReproductionIndex: FCWithLayout<IProps> = ({ data }) => {
  const lastKnownValidData: ReproductionIndexData =
    data.reproduction_index_last_known_average;

  const reproductionData: ReproductionIndexData = data.reproduction_index;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={text.titel}
        Icon={Repro}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: reproductionData.last_value.date_of_report_unix,
          dateInsertedUnix: reproductionData.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <ReproductionIndexBarScale
            data={reproductionData}
            lastKnown={lastKnownValidData}
          />
          <p>{text.barscale_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <img
            width={315}
            height={100}
            loading="lazy"
            src="/images/reproductie-explainer.svg"
            alt={text.reproductie_explainer_alt}
          />
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>
        {reproductionData.values && (
          <AreaChart
            data={reproductionData.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={1}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
            timeframeOptions={['all', '5weeks']}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_r}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>
      </article>
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout();

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<IProps> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: JSON.parse(fileContents),
    },
  };
};

export default ReproductionIndex;
