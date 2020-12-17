import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import LineChart from '~/components/lineChart';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const router = useRouter();

  const lastValue = data.hospital_admissions.last_value;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />

      <ContentHeader
        category={siteText.gemeente_layout.headings.ziekenhuizen}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
        })}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: lastValue.date_of_report_unix,
          dateOfInsertionUnix: lastValue.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          showDataWarning
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="moving_average_hospital"
            absolute={lastValue.moving_average_hospital}
            difference={
              data.difference.hospital_admissions__moving_average_hospital
            }
          />
        </KpiTile>
      </TwoKpiSection>

      {lastValue && (
        <ChartTileWithTimeframe
          showDataWarning
          title={text.linechart_titel}
          description={text.linechart_description}
          metadata={{ source: text.bronnen.rivm }}
        >
          {(timeframe) => (
            <LineChart
              timeframe={timeframe}
              values={data.hospital_admissions.values.map((value) => ({
                value: value.moving_average_hospital,
                date: value.date_of_report_unix,
              }))}
            />
          )}
        </ChartTileWithTimeframe>
      )}

      <ChoroplethTile
        showDataWarning
        title={replaceVariablesInText(text.map_titel, {
          municipality: municipalityName,
        })}
        metadata={{
          date: lastValue.date_of_report_unix,
          source: text.bronnen.rivm,
        }}
        description={text.map_toelichting}
        legend={{
          title: siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
          thresholds:
            municipalThresholds.hospital_admissions.hospital_admissions,
        }}
      >
        <MunicipalityChoropleth
          selected={data.code}
          metricName="hospital_admissions"
          metricProperty="hospital_admissions"
          tooltipContent={createMunicipalHospitalAdmissionsTooltip(
            createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
          )}
          onSelect={createSelectMunicipalHandler(router, 'ziekenhuis-opnames')}
        />
      </ChoroplethTile>
    </>
  );
};

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
