import { useRouter } from 'next/router';

import siteText from '~/locale/index';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import { ResultsPerRegion } from '~/types/data.d';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';

import { createMunicipalHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/createMunicipalHospitalAdmissionsTooltip';
import { LineChart } from '~/components/charts/index';
import { IntakeHospitalBarScale } from '~/components/veiligheidsregio/intake-hospital-barscale';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useMunicipalLegendaData } from '~/components/chloropleth/legenda/hooks/useMunicipalLegendaData';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { ContentHeader } from '~/components/layout/Content';

import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text: typeof siteText.veiligheidsregio_ziekenhuisopnames_per_dag =
  siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

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
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={resultsPerRegion} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {resultsPerRegion && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={resultsPerRegion.values.map((value: any) => ({
              value: value.hospital_moving_avg_per_region,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              safetyRegion: safetyRegionName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <MunicipalityChloropleth
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

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
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
