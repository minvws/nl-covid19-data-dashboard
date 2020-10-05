import Arts from '~/assets/arts.svg';
import { LineChart } from '~/components/charts/index';
import { Kpi } from '~/components/kpi';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { MetricValue } from '~/components/metricValue';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { IntakeIntensivecareMa } from '~/types/data.d';

const text = siteText.ic_opnames_per_dag;

const IntakeIntensiveCare: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: IntakeIntensivecareMa | undefined =
    state?.intake_intensivecare_ma;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeIntensiveCareBarscale data={data} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <div className="layout-kpis">
        <Kpi title={text.barscale_titel} description={text.extra_uitleg}>
          <IntakeIntensiveCareBarscale data={data} showAxis={true} />
        </Kpi>

        <Kpi
          title={text.kpi_bedbezetting.title}
          description={text.kpi_bedbezetting.description}
          sourcedFrom={text.kpi_bedbezetting.sourced_from}
        >
          <MetricValue absolute={12312} />
        </Kpi>
      </div>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.moving_average_ic,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={10}
          />
        </article>
      )}
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default IntakeIntensiveCare;
