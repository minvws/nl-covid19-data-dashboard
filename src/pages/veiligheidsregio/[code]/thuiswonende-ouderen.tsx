import ElderlyIcon from '~/assets/elderly.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_thuiswonende_ouderen;

const ElderlyAtHomeRegionalPage: FCWithLayout<ISafetyRegionData> = (props) => {
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
            dateInfo: elderlyAtHomeData.last_value.date_of_report_unix,
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
              date: elderlyAtHomeData.last_value.date_of_report_unix,
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
              date: elderlyAtHomeData.last_value.date_of_report_unix,
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
          values={elderlyAtHomeData.values.map((value) => ({
            value: value.positive_tested_daily,
            date: value.date_of_report_unix,
          }))}
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
            dateInfo: elderlyAtHomeData.last_value.date_of_report_unix,
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
              date: elderlyAtHomeData.last_value.date_of_report_unix,
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
          values={elderlyAtHomeData.values.map((value) => ({
            value: value.deceased_daily,
            date: value.date_of_report_unix,
          }))}
          metadata={{ source: text.section_positive_tested.bronnen.rivm }}
        />
      </TileList>
    </>
  );
};

ElderlyAtHomeRegionalPage.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default ElderlyAtHomeRegionalPage;
