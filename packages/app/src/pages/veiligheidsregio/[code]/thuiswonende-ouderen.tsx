import ElderlyIcon from '~/assets/elderly.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components-styled/seo-head';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const text = siteText.veiligheidsregio_thuiswonende_ouderen;
const graphDescriptions = siteText.accessibility.grafieken;

const ElderlyAtHomeRegionalPage: FCWithLayout<typeof getStaticProps> = (
  props
) => {
  const { safetyRegionName, data } = props;
  const elderlyAtHomeData = data.elderly_at_home;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegion: safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegion: safetyRegionName,
        })}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.kwetsbare_groepen}
          screenReaderCategory={siteText.thuiswonende_ouderen.titel_sidebar}
          title={replaceVariablesInText(text.section_positive_tested.title, {
            safetyRegion: safetyRegionName,
          })}
          icon={<ElderlyIcon />}
          subtitle={replaceVariablesInText(
            text.section_positive_tested.description,
            {
              safetyRegion: safetyRegionName,
            }
          )}
          metadata={{
            datumsText: text.section_positive_tested.datums,
            dateOrRange: elderlyAtHomeData.last_value.date_unix,
            dateOfInsertionUnix:
              elderlyAtHomeData.last_value.date_of_insertion_unix,
            dataSources: [text.section_positive_tested.bronnen.rivm],
          }}
          reference={text.section_positive_tested.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.section_positive_tested.kpi_daily_title}
            metadata={{
              date: elderlyAtHomeData.last_value.date_unix,
              source: text.section_positive_tested.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="positive_tested_daily"
              absolute={elderlyAtHomeData.last_value.positive_tested_daily}
            />
            <Text>{text.section_positive_tested.kpi_daily_description}</Text>
          </KpiTile>
          <KpiTile
            title={text.section_positive_tested.kpi_daily_per_100k_title}
            metadata={{
              date: elderlyAtHomeData.last_value.date_unix,
              source: text.section_positive_tested.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="positive_tested_daily_per_100k"
              absolute={
                elderlyAtHomeData.last_value.positive_tested_daily_per_100k
              }
            />
            <Text>
              {text.section_positive_tested.kpi_daily_per_100k_description}
            </Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          title={text.section_positive_tested.line_chart_daily_title}
          values={elderlyAtHomeData.values}
          ariaDescription={graphDescriptions.thuiswonende_ouderen_besmettingen}
          linesConfig={[
            {
              metricProperty: 'positive_tested_daily',
            },
          ]}
          metadata={{ source: text.section_positive_tested.bronnen.rivm }}
        />

        <ContentHeader
          title={replaceVariablesInText(text.section_deceased.title, {
            safetyRegion: safetyRegionName,
          })}
          icon={<ElderlyIcon />}
          subtitle={replaceVariablesInText(text.section_deceased.description, {
            safetyRegion: safetyRegionName,
          })}
          metadata={{
            datumsText: text.section_deceased.datums,
            dateOrRange: elderlyAtHomeData.last_value.date_unix,
            dateOfInsertionUnix:
              elderlyAtHomeData.last_value.date_of_insertion_unix,
            dataSources: [text.section_deceased.bronnen.rivm],
          }}
          reference={text.section_deceased.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.section_deceased.kpi_daily_title}
            description={text.section_deceased.kpi_daily_description}
            metadata={{
              date: elderlyAtHomeData.last_value.date_unix,
              source: text.section_deceased.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="deceased_daily"
              absolute={elderlyAtHomeData.last_value.deceased_daily}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          timeframeOptions={['all', '5weeks']}
          title={text.section_deceased.line_chart_daily_title}
          ariaDescription={graphDescriptions.thuiswonende_ouderen_overleden}
          values={elderlyAtHomeData.values}
          linesConfig={[
            {
              metricProperty: 'deceased_daily',
            },
          ]}
          metadata={{ source: text.section_positive_tested.bronnen.rivm }}
        />
      </TileList>
    </>
  );
};

ElderlyAtHomeRegionalPage.getLayout = getSafetyRegionLayout();

export default ElderlyAtHomeRegionalPage;
