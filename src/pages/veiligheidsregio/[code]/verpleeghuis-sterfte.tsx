import CoronaVirus from '~/assets/coronavirus.svg';
import { LineChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { RegionalNursingHome } from '~/types/data.d';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Metadata } from '~/components-styled/metadata';
import { KpiValue } from '~/components-styled/kpi-value';
import { KpiTile } from '~/components-styled/kpi-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';

const text = siteText.veiligheidsregio_verpleeghuis_oversterfte;

const NursingHomeDeaths: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data: state, safetyRegionName } = props;

  const data: RegionalNursingHome | undefined = state?.nursing_home;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.verpleeghuizen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
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
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.deceased_daily,
              date: value.date_of_report_unix,
            }))}
          />
          <Metadata source={text.bron} />
        </article>
      )}
    </>
  );
};

NursingHomeDeaths.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeDeaths;
