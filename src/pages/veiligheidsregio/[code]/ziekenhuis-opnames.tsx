import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { ContentHeader } from '~/components/layout/Content';

import Ziekenhuis from '~/assets/ziekenhuis.svg';

import siteText from '~/locale/index';

import { ResultsPerRegion } from '~/types/data.d';
import { LineChart } from '~/components/charts/index';
import { IntakeHospitalBarScale } from '~/components/veiligheidsregio/intake-hospital-barscale';

import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { getLocalTitleForRegion } from '~/utils/getLocalTitleForCode';
import { hospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/hospitalAdmissionsTooltip';
import { MunicipalityLegenda } from '~/components/chloropleth/legenda/MunicipalityLegenda';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { useRouter } from 'next/router';

const text: typeof siteText.veiligheidsregio_ziekenhuisopnames_per_dag =
  siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data } = props;
  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  return (
    <>
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.medisch}
        title={getLocalTitleForRegion(text.titel, data.code)}
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
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForRegion(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>

          <MunicipalityLegenda
            metricName="hospital_admissions"
            title={siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityChloropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            metricName="hospital_admissions"
            tooltipContent={hospitalAdmissionsTooltip}
            onSelect={createSelectMunicipalHandler(router)}
          />
        </div>
      </article>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
