import Arts from '~/assets/arts.svg';
import { LineChart } from '~/components/charts/index';
import { ContentHeaderMetadataHack } from '~/components/contentHeaderMetadataHack';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

const text = siteText.ic_opnames_per_dag;

const IntakeIntensiveCare: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const dataIntake = state.intake_intensivecare_ma;

  const dataBeds = state.intensive_care_beds_occupied;

  return (
    <>
      <ContentHeaderMetadataHack
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: dataIntake.last_value.date_of_report_unix,
          dateInsertedUnix: dataIntake.last_value.date_of_insertion_unix,
          dataSourceA: text.bronnen.nice,
          dataSourceB: text.bronnen.lnaz,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <div className="article-top">
            <h3>{text.barscale_titel}</h3>
            <IntakeIntensiveCareBarscale data={dataIntake} showAxis={true} />
            <p>{text.extra_uitleg}</p>
          </div>
          <footer className="article-footer">
            {siteText.common.metadata.source}:{' '}
            <a href={text.bronnen.nice.href}>{text.bronnen.nice.text}</a>
          </footer>
        </article>

        <article className="metric-article column-item">
          <div className="article-top">
            <h3>{text.kpi_bedbezetting.title}</h3>
            <div className="text-blue kpi">
              {`${formatNumber(
                dataBeds.last_value.covid_occupied
              )} (${formatPercentage(
                dataBeds.last_value.covid_percentage_of_all_occupied
              )}%)`}
            </div>
            <p>{text.kpi_bedbezetting.description}</p>
          </div>
          <footer className="article-footer">
            {siteText.common.metadata.source}:{' '}
            <a href={text.bronnen.lnaz.href}>{text.bronnen.lnaz.text}</a>
          </footer>
        </article>
      </div>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={dataIntake.values.map((value) => ({
            value: value.moving_average_ic,
            date: value.date_of_report_unix,
          }))}
          signaalwaarde={10}
        />
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a href={text.bronnen.nice.href}>{text.bronnen.nice.text}</a>
        </footer>
      </article>

      <article className="metric-article">
        <LineChart
          title={text.chart_bedbezetting.title}
          description={text.chart_bedbezetting.description}
          values={dataBeds.values.map((value) => ({
            value: value.covid_occupied,
            date: value.date_of_report_unix,
          }))}
        />
        <footer className="article-footer">
          {siteText.common.metadata.source}:{' '}
          <a href={text.bronnen.lnaz.href}>{text.bronnen.lnaz.text}</a>
        </footer>
      </article>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeIntensiveCare;
