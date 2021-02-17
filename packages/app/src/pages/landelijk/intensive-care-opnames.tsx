import { getLastFilledValue } from '@corona-dashboard/common';
import Arts from '~/assets/arts.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic';
import { PageBarScale } from '~/components-styled/page-barscale';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { createDate } from '~/utils/createDate';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.ic_opnames_per_dag;
const graphDescriptions = siteText.accessibility.grafieken;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('intensiveCarePage'))
);

const IntakeIntensiveCare: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, content } = props;

  const dataIntake = data.intensive_care_nice;

  const bedsLastValue = getLastFilledValue(data.intensive_care_lcps);

  const icOldDataRange = [
    createDate(data.intensive_care_lcps.values[0].date_unix),
    new Date('1 June 2020'),
  ];

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.ziekenhuizen}
          screenReaderCategory={siteText.ic_opnames_per_dag.titel_sidebar}
          title={text.titel}
          icon={<Arts />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: dataIntake.last_value.date_unix,
            dateOfInsertionUnix: dataIntake.last_value.date_of_insertion_unix,
            dataSources: [text.bronnen.nice, text.bronnen.lnaz],
          }}
          reference={text.reference}
        />

        <ArticleStrip articles={content?.articles} />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: dataIntake.last_value.date_unix,
              source: text.bronnen.nice,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="intensive_care_nice"
              metricProperty="admissions_moving_average"
              localeTextKey="ic_opnames_per_dag"
              differenceKey="intensive_care_nice__admissions_moving_average"
            />
            <Text>{text.extra_uitleg}</Text>
          </KpiTile>

          <KpiTile
            title={text.kpi_bedbezetting.title}
            metadata={{
              date: bedsLastValue.date_unix,
              source: text.bronnen.lnaz,
            }}
          >
            <KpiValue
              data-cy="beds_occupied_covid"
              absolute={bedsLastValue.beds_occupied_covid!}
              percentage={bedsLastValue.beds_occupied_covid_percentage!}
              difference={
                data.difference.intensive_care_lcps__beds_occupied_covid
              }
            />
            <Text>{text.kpi_bedbezetting.description}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          values={dataIntake.values}
          ariaDescription={graphDescriptions.intensive_care_opnames}
          linesConfig={[
            {
              metricProperty: 'admissions_moving_average',
            },
          ]}
          signaalwaarde={10}
          metadata={{ source: text.bronnen.nice }}
        />

        <LineChartTile
          title={text.chart_bedbezetting.title}
          description={text.chart_bedbezetting.description}
          values={data.intensive_care_lcps.values}
          linesConfig={[
            {
              metricProperty: 'beds_occupied_covid',
            },
          ]}
          metadata={{ source: text.bronnen.lnaz }}
          componentCallback={addBackgroundRectangleCallback(
            [
              createDate(data.intensive_care_lcps.values[0].date_unix),
              new Date('1 June 2020'),
            ],
            {
              fill: colors.data.underReported,
            }
          )}
          formatTooltip={(values) => {
            const value = values[0];
            const isInaccurateValue = value.__date < icOldDataRange[0];

            return (
              <>
                <Box display="flex" alignItems="center" flexDirection="column">
                  {isInaccurateValue && (
                    <Text as="span" fontSize={0} color={colors.annotation}>
                      ({siteText.common.incomplete})
                    </Text>
                  )}
                  <Box>
                    <Text as="span" fontWeight="bold">
                      {`${formatDateFromSeconds(value.date_unix)}: `}
                    </Text>
                    {formatNumber(value.__value)}
                  </Box>
                </Box>
              </>
            );
          }}
        />
      </TileList>
    </>
  );
};

IntakeIntensiveCare.getLayout = getNationalLayout;

export default IntakeIntensiveCare;
