import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { ResultsPerRegion } from '~/types/data.d';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;
  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

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
        category={siteText.veiligheidsregio_layout.headings.ziekenhuizen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion.last_value.date_of_report_unix,
          dateInsertedUnix: resultsPerRegion.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          showDataWarning
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: resultsPerRegion.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={
              resultsPerRegion.last_value.hospital_moving_avg_per_region
            }
          />
        </KpiTile>
      </TwoKpiSection>

      {resultsPerRegion && (
        <LineChartTile
          showDataWarning
          metadata={{ source: text.bron }}
          title={text.linechart_titel}
          description={text.linechart_description}
          values={resultsPerRegion.values.map((value: any) => ({
            value: value.hospital_moving_avg_per_region,
            date: value.date_of_report_unix,
          }))}
        />
      )}

      <ChoroplethTile
        showDataWarning
        title={replaceVariablesInText(text.map_titel, {
          safetyRegion: safetyRegionName,
        })}
        description={text.map_toelichting}
        legend={{
          thresholds: municipalThresholds.hospital_admissions,
          title: siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
        }}
        metadata={{
          date: resultsPerRegion.last_value.date_of_report_unix,
          source: text.bron,
        }}
      >
        <MunicipalityChoropleth
          selected={selectedMunicipalCode}
          highlightSelection={false}
          metricName="hospital_admissions"
          tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
          onSelect={createSelectMunicipalHandler(router, 'ziekenhuis-opnames')}
        />
      </ChoroplethTile>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
