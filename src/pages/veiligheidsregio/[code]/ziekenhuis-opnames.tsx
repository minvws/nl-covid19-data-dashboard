import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { ContentHeader } from 'components/layout/Content';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import siteText from 'locale';

import { ResultsPerRegion } from 'types/data';
import { LineChart } from 'components/charts/index';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from 'static-props/safetyregion-data';
import MunicipalityMap from 'components/vx/MunicipalityMap';

const text: typeof siteText.veiligheidsregio_ziekenhuisopnames_per_dag =
  siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: {
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.hospital_moving_avg_per_region}
      id="opnames"
      rangeKey="hospital_moving_avg_per_region"
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

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data } = props;

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={replaceVariablesInText(text.titel, {
          safetyRegion: data.name,
        })}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            resultsPerRegion?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={resultsPerRegion} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>
      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {resultsPerRegion && (
          <>
            <LineChart
              values={resultsPerRegion.values.map((value: any) => ({
                value: value.hospital_moving_avg_per_region,
                date: value.date_of_report_unix,
              }))}
              signaalwaarde={40}
            />
          </>
        )}
      </article>
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityMap
            selected={data.code}
            metric="hospital_admissions"
            gradient={['#9DDEFE', '#0290D6']}
          />
        </div>
      </article>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
