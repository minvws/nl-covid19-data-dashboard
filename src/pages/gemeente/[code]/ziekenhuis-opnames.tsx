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
import { Metadata } from '~/components-styled/metadata';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiValue } from '~/components-styled/kpi-value';
import { KpiTile } from '~/components-styled/kpi-tile';

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
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: hospitalAdmissions.last_value.date_of_report_unix,
          dateInsertedUnix:
            hospitalAdmissions.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
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
        <article className="metric-article">
          <DataWarning />
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_description}
            values={hospitalAdmissions.values.map((value: any) => ({
              value: value.moving_average_hospital,
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
              municipality: municipalityName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="choropleth-chart">
          <MunicipalityChoropleth
            selected={data.code}
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
          date={hospitalAdmissions.last_value.date_of_report_unix}
          source={text.bron}
        />
      </article>
    </>
  );
};

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
