import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';
import { ContentHeader } from 'components/layout/Content';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import siteText from 'locale';

import { National, IntakeHospitalMa } from 'types/data';
import MunicipalityMap from 'components/mapChart';

const text: typeof siteText.ziekenhuisopnames_per_dag =
  siteText.ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: { data: IntakeHospitalMa }) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.moving_average_hospital}
      id="opnames"
      rangeKey="moving_average_hospital"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 40,
        },
        {
          color: '#f35065',
          value: 90,
        },
      ]}
    />
  );
}

interface IProps {
  data: National;
}

const IntakeHospital: FCWithLayout<IProps> = ({ data }) => {
  const intakeData: IntakeHospitalMa = data.intake_hospital_ma;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={text.titel}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: intakeData?.last_value?.date_of_report_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={intakeData} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityMap
            metric="Hospital_admission"
            gradient={['#69c253', '#f35065']}
          />
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {intakeData && (
          <>
            <LineChart
              values={intakeData.values.map((value: any) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={40}
            />
          </>
        )}
      </article>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout();

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

export default IntakeHospital;
