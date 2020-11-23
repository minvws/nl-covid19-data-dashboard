import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { LineChart } from '~/components/charts/index';
import { useMunicipalLegendaData } from '~/components/choropleth/legenda/hooks/use-municipal-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { MunicipalHospitalAdmissions } from '~/types/data.d';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const router = useRouter();

  const legendItems = useMunicipalLegendaData('hospital_admissions');
  const hospitalAdmissions: MunicipalHospitalAdmissions | undefined =
    data?.hospital_admissions;

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
          dateUnix: hospitalAdmissions.last_value.date_of_report_unix,
          dateInsertedUnix:
            hospitalAdmissions.last_value.date_of_insertion_unix,
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
            date: hospitalAdmissions.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={hospitalAdmissions.last_value.moving_average_hospital}
          />
        </KpiTile>
      </TwoKpiSection>

      {hospitalAdmissions && (
        <ChartTileWithTimeframe
          showDataWarning
          title={text.linechart_titel}
          description={text.linechart_description}
          metadata={{ source: text.bron }}
        >
          {(timeframe) => (
            <>
              <LineChart
                timeframe={timeframe}
                values={hospitalAdmissions.values.map((value: any) => ({
                  value: value.moving_average_hospital,
                  date: value.date_of_report_unix,
                }))}
              />
            </>
          )}
        </ChartTileWithTimeframe>
      )}

      <ChoroplethTile
        showDataWarning
        title={replaceVariablesInText(text.map_titel, {
          municipality: municipalityName,
        })}
        metadata={{
          date: hospitalAdmissions.last_value.date_of_report_unix,
          source: text.bron,
        }}
        description={text.map_toelichting}
        legend={
          legendItems // this data value should probably not be optional
            ? {
                title:
                  siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
                items: legendItems,
              }
            : undefined
        }
      >
        <MunicipalityChoropleth
          selected={data.code}
          metricName="hospital_admissions"
          tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
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
