import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import { ContentHeader } from 'components/layout/Content';
import { FCWithLayout } from 'components/layout';
import {
  getNationalLayout,
  NationalLayoutProps,
} from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Arts from 'assets/arts.svg';

import formatNumber from 'utils/formatNumber';

import siteText from 'locale';

import { VerdenkingenHuisartsen } from 'types/data';

const text: typeof siteText.verdenkingen_huisartsen =
  siteText.verdenkingen_huisartsen;

export function SuspectedPatientsBarScale(props: {
  data: VerdenkingenHuisartsen;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={140}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.incidentie as number | null}
      id="verdenkingen_huisartsen"
      rangeKey="incidentie"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const SuspectedPatients: FCWithLayout<NationalLayoutProps> = ({
  data: state,
}) => {
  const data: VerdenkingenHuisartsen = state.verdenkingen_huisartsen;
  const total = state.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  return (
    <>
      <ContentHeader
        category="Overige indicatoren"
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.week_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          <SuspectedPatientsBarScale data={data} />
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {total && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">{formatNumber(total)}</span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {data && (
          <LineChart
            timeframeOptions={['all', '5weeks']}
            values={data.values.map((value) => ({
              value: value.incidentie,
              date: value.week_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout();

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

export default SuspectedPatients;
