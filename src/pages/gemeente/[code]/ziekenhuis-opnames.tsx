import { useRouter } from 'next/router';

import siteText from '~/locale/index';
import { HospitalAdmissions } from '~/types/data.d';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

import { LineChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { ContentHeader } from '~/components/layout/Content';
import { IntakeHospitalBarScale } from '~/components/gemeente/intake-hospital-barscale';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/chloropleth/tooltips/municipal/createMunicipalHospitalAdmissionsTooltip';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { useMunicipalLegendaData } from '~/components/chloropleth/legenda/hooks/useMunicipalLegendaData';

import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const router = useRouter();

  const legendItems = useMunicipalLegendaData('hospital_admissions');
  const hospitalAdmissions: HospitalAdmissions | undefined =
    data?.hospital_admissions;

  return (
    <>
      <ContentHeader
        category={siteText.gemeente_layout.headings.medisch}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
        })}
        Icon={Ziekenhuis}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: hospitalAdmissions?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            hospitalAdmissions?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <IntakeHospitalBarScale data={hospitalAdmissions} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {hospitalAdmissions && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={hospitalAdmissions.values.map((value: any) => ({
              value: value.moving_average_hospital,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <MunicipalityChloropleth
            selected={data.code}
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

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
