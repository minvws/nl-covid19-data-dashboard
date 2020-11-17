import Getest from '~/assets/test.svg';
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
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Metadata } from '~/components-styled/metadata';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';

const text = siteText.veiligheidsregio_verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<ISafetyRegionData> = ({
  data,
  safetyRegionName,
}) => {
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
        Icon={Getest}
        subtitle={replaceVariablesInText(text.pagina_toelichting, {
          safetyRegion: safetyRegionName,
        })}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.nursing_home.last_value.date_of_report_unix,
          dateInsertedUnix: data.nursing_home.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: data.nursing_home.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={data.nursing_home.last_value.newly_infected_people}
          />
        </KpiTile>
      </TwoKpiSection>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={data.nursing_home.values.map((value) => ({
            value: value.newly_infected_people,
            date: value.date_of_report_unix,
          }))}
        />
        <Metadata source={text.bron} />
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeInfectedPeople;
