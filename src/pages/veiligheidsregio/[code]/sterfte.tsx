import CoronaVirusIcon from '~/assets/coronavirus.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import { DeceasedMonitorSection } from '~/domain/deceased/deceased-monitor-section';
import siteText from '~/locale/index';
import {
  getSafetyRegionStaticProps,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_sterfte;

const DeceasedRegionalPage: FCWithLayout<ISafetyRegionData> = (props) => {
  const {
    safetyRegionName: safetyRegion,
    data: { deceased_cbs: dataCbs, deceased_rivm: dataRivm },
  } = props;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, { safetyRegion })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegion,
        })}
      />

      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.besmettingen}
        title={replaceVariablesInText(text.section_deceased_rivm.title, {
          safetyRegion,
        })}
        icon={<CoronaVirusIcon />}
        subtitle={text.section_deceased_rivm.description}
        reference={text.section_deceased_rivm.reference}
        metadata={{
          datumsText: text.section_deceased_rivm.datums,
          dateInfo: dataRivm.last_value.date_of_report_unix,
          dateOfInsertionUnix: dataRivm.last_value.date_of_insertion_unix,
          dataSources: [text.section_deceased_rivm.bronnen.rivm],
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.section_deceased_rivm.kpi_covid_daily_title}
          metadata={{
            date: dataRivm.last_value.date_of_report_unix,
            source: text.section_deceased_rivm.bronnen.rivm,
          }}
        >
          <KpiValue absolute={dataRivm.last_value.covid_daily} />
          <Text>{text.section_deceased_rivm.kpi_covid_daily_description}</Text>
        </KpiTile>
        <KpiTile
          title={text.section_deceased_rivm.kpi_covid_total_title}
          metadata={{
            date: dataRivm.last_value.date_of_report_unix,
            source: text.section_deceased_rivm.bronnen.rivm,
          }}
        >
          <KpiValue absolute={dataRivm.last_value.covid_total} />
          <Text>{text.section_deceased_rivm.kpi_covid_total_description}</Text>
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        timeframeOptions={['all', '5weeks']}
        timeframeInitialValue="all"
        title={text.section_deceased_rivm.line_chart_covid_daily_title}
        values={dataRivm.values.map((value) => ({
          value: value.covid_daily,
          date: value.date_of_report_unix,
        }))}
        metadata={{ source: text.section_deceased_rivm.bronnen.rivm }}
      />

      <DeceasedMonitorSection data={dataCbs} />
    </>
  );
};

DeceasedRegionalPage.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;

export const getStaticPaths = getSafetyRegionPaths();

export default DeceasedRegionalPage;
