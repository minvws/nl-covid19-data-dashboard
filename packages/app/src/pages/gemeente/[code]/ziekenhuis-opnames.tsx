import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
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

  const lastValue = data.hospital_nice.last_value;

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
      <TileList>
        <ContentHeader
          category={siteText.gemeente_layout.headings.ziekenhuizen}
          title={replaceVariablesInText(text.titel, {
            municipality: municipalityName,
          })}
          icon={<Ziekenhuis />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            description={text.extra_uitleg}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="admissions_moving_average"
              absolute={lastValue.admissions_moving_average}
              difference={
                data.difference.hospital_nice__admissions_moving_average
              }
            />
          </KpiTile>
        </TwoKpiSection>

        <ChoroplethTile
          title={replaceVariablesInText(text.map_titel, {
            municipality: municipalityName,
          })}
          metadata={{
            date: lastValue.date_unix,
            source: text.bronnen.rivm,
          }}
          description={text.map_toelichting}
          legend={{
            title: siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
            thresholds:
              municipalThresholds.hospital_nice.admissions_moving_average,
          }}
        >
          <MunicipalityChoropleth
            selected={data.code}
            metricName="hospital_nice"
            metricProperty="admissions_moving_average"
            tooltipContent={createMunicipalHospitalAdmissionsTooltip(
              createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
            )}
            onSelect={createSelectMunicipalHandler(
              router,
              'ziekenhuis-opnames'
            )}
          />
        </ChoroplethTile>

        {lastValue && (
          <LineChartTile
            title={text.linechart_titel}
            description={text.linechart_description}
            metadata={{ source: text.bronnen.rivm }}
            timeframeOptions={['all', '5weeks', 'week']}
            timeframeInitialValue="5weeks"
            values={data.hospital_nice.values}
            linesConfig={[
              {
                metricProperty: 'admissions_moving_average',
              },
            ]}
          />
        )}
      </TileList>
    </>
  );
};

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
