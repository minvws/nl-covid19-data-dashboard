import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Arts from 'assets/arts.svg';

import siteText from 'locale';

import { IntakeIntensivecareMa } from 'types/data';

const text: typeof siteText.ic_opnames_per_dag = siteText.ic_opnames_per_dag;

interface IProps {
  data: IntakeIntensivecareMa;
}

export function IntakeIntensiveCareBarscale(props: {
  data: IntakeIntensivecareMa;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 10,
        },
        {
          color: '#f35065',
          value: 20,
        },
      ]}
      rangeKey="moving_average_ic"
      screenReaderText={text.screen_reader_graph_content}
      signaalwaarde={10}
      value={data.last_value.moving_average_ic}
      id="ic"
    />
  );
}

const IntakeIntensiveCare: FCWithLayout<IProps> = ({ data }) => {
  return (
    <>
      <TitleWithIcon Icon={Arts} title={text.title} as="h2" />

      <article className="metric-article">
        <p>{text.text}</p>

        <IntakeIntensiveCareBarscale data={data} />

        {data.last_value?.moving_average_ic !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={data.last_value?.date_of_report_unix}
          />
        )}

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.moving_average_ic,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={10}
            />

            <Metadata dataSource={text.bron} />
          </>
        )}
      </article>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<IProps> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: JSON.parse(fileContents).intake_intensivecare_ma,
    },
  };
};

export default IntakeIntensiveCare;
