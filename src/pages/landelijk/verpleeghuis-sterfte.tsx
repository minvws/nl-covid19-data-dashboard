import CoronaVirus from '~/assets/coronavirus.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

const text = siteText.verpleeghuis_oversterfte;

const NursingHomeDeaths: FCWithLayout<INationalData> = (props) => {
  const data = props.data.nursing_home;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuizen}
        title={text.titel}
        Icon={CoronaVirus}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.last_value.date_of_report_unix,
          dateInsertedUnix: data.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: data.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue absolute={data.last_value.deceased_daily} />
        </KpiTile>
      </TwoKpiSection>

      {data && (
        <LineChartTile
          metadata={{ source: text.bron }}
          title={text.linechart_titel}
          values={data.values.map((value) => ({
            value: value.deceased_daily,
            date: value.date_of_report_unix,
          }))}
        />
      )}
    </>
  );
};

NursingHomeDeaths.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeDeaths;
