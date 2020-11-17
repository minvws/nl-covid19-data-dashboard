import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { useMunicipalLegendaData } from '~/components/choropleth/legenda/hooks/use-municipal-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { DataWarning } from '~/components/dataWarning';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
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
import { Metadata } from '~/components-styled/metadata';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';

const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;
  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  const legendItems = useMunicipalLegendaData('hospital_admissions');
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
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion.last_value.date_of_report_unix,
          dateInsertedUnix: resultsPerRegion.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
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
        <article className="metric-article">
          <DataWarning />
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_description}
            values={resultsPerRegion.values.map((value: any) => ({
              value: value.hospital_moving_avg_per_region,
              date: value.date_of_report_unix,
            }))}
          />
          <Metadata source={text.bron} />
        </article>
      )}
      <article className="metric-article layout-choropleth">
        <div className="data-warning">
          <DataWarning />
        </div>
        <div className="choropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              safetyRegion: safetyRegionName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="choropleth-chart">
          <MunicipalityChoropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            metricName="hospital_admissions"
            tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
            onSelect={createSelectMunicipalHandler(
              router,
              'ziekenhuis-opnames'
            )}
          />
        </div>

        <div className="choropleth-legend">
          {legendItems && (
            <ChoroplethLegenda
              items={legendItems}
              title={
                siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel
              }
            />
          )}
        </div>
        <Metadata
          date={resultsPerRegion.last_value.date_of_report_unix}
          source={text.bron}
        />
      </article>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
