import { formatNumber } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/components/chart-axes/component-callbacks/add-background-rectangle-callback';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { SEOHead } from '~/components-styled/seo-head';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getVrData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { getTrailingDateRange } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
  createGetChoroplethData({
    gm: ({ hospital_nice }) => ({ hospital_nice }),
  })
);

const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;
const graphDescriptions = siteText.accessibility.grafieken;

const IntakeHospital: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, safetyRegionName, choropleth } = props;
  const router = useRouter();

  const lastValue = data.hospital_nice.last_value;

  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  const underReportedRange = getTrailingDateRange(data.hospital_nice.values, 4);

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

      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.ziekenhuizen}
          title={replaceVariablesInText(text.titel, {
            safetyRegion: safetyRegionName,
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
              data-cy="hospital_moving_avg_per_region"
              absolute={lastValue.admissions_on_date_of_reporting}
              difference={
                data.difference.hospital_nice__admissions_on_date_of_reporting
              }
            />
          </KpiTile>
        </TwoKpiSection>

        <ChoroplethTile
          title={replaceVariablesInText(text.map_titel, {
            safetyRegion: safetyRegionName,
          })}
          description={text.map_toelichting}
          legend={{
            thresholds:
              municipalThresholds.hospital_nice.admissions_on_date_of_reporting,
            title: siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
          }}
          metadata={{
            date: lastValue.date_unix,
            source: text.bronnen.rivm,
          }}
        >
          <MunicipalityChoropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
            data={choropleth.gm}
            metricName="hospital_nice"
            metricProperty="admissions_on_date_of_reporting"
            tooltipContent={createMunicipalHospitalAdmissionsTooltip(
              createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
            )}
            onSelect={createSelectMunicipalHandler(
              router,
              'ziekenhuis-opnames'
            )}
          />
        </ChoroplethTile>

        <LineChartTile
          metadata={{ source: text.bronnen.rivm }}
          title={text.linechart_titel}
          ariaDescription={graphDescriptions.ziekenhuis_opnames}
          values={data.hospital_nice.values}
          formatTooltip={(values) => {
            const value = values[0];
            const isInrange =
              value.__date >= underReportedRange[0] &&
              value.__date <= underReportedRange[1];
            return (
              <>
                <Box display="flex" alignItems="center" flexDirection="column">
                  {isInrange && (
                    <Text as="span" fontSize={0} color={colors.annotation}>
                      ({siteText.common.incomplete})
                    </Text>
                  )}
                  <Box>
                    <Text as="span" fontWeight="bold">
                      {`${formatDateFromMilliseconds(
                        value.__date.getTime()
                      )}: `}
                    </Text>
                    {formatNumber(value.__value)}
                  </Box>
                </Box>
              </>
            );
          }}
          linesConfig={[
            {
              metricProperty: 'admissions_on_date_of_admission',
            },
          ]}
          componentCallback={addBackgroundRectangleCallback(
            underReportedRange,
            {
              fill: colors.data.underReported,
            }
          )}
          legendItems={[
            {
              color: colors.data.primary,
              label: text.linechart_legend_titel,
              shape: 'line',
            },
            {
              color: colors.data.underReported,
              label: text.linechart_legend_underreported_titel,
              shape: 'square',
            },
          ]}
          showLegend
        />
      </TileList>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export default IntakeHospital;
