import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useMunicipalLegendaData } from '~/components/choropleth/legenda/hooks/useMunicipalLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/createMunicipalHospitalAdmissionsTooltip';
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
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

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
        category={siteText.veiligheidsregio_layout.headings.medisch}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
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
      <article className="metric-article layout-two-column-two-row">
        <DataWarning />
        <div className="row-item">
          <div className="column-item column-item-extra-margin">
            <h3>{text.barscale_titel}</h3>
            <p className="text-blue kpi" data-cy="infected_daily_total">
              {formatNumber(
                resultsPerRegion.last_value.hospital_increase_per_region
              )}
            </p>
          </div>

          <div className="column-item column-item-extra-margin">
            <p>{text.extra_uitleg}</p>
          </div>
        </div>
      </article>

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
      </article>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
