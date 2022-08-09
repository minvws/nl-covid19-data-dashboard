import { colors, TimeframeOptionsList } from '@corona-dashboard/common';
import { External, Phone } from '@corona-dashboard/icons';
import { css } from '@styled-system/css';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { WarningTile } from '~/components';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text, BoldText } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  getLokalizeTexts,
  selectNlData,
} from '~/static-props/get-data';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.behavior_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData(
    'difference.corona_melder_app_warning__count',
    'corona_melder_app_warning',
    'corona_melder_app_download'
  )
);

const CoronamelderPage = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts, formatNumber } = useIntl();

  const { pageText, selectedNlData: data, lastGenerated } = props;
  const { corona_melder_app } = commonTexts;
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(
    pageText,
    selectLokalizeTexts
  );

  const warningLastValue = data.corona_melder_app_warning.last_value;
  const endDate = createDateFromUnixTimestamp(warningLastValue.date_unix);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.archief}
            title={corona_melder_app.header.title}
            icon={<Phone />}
            description={corona_melder_app.header.description}
            metadata={{
              datumsText: corona_melder_app.header.datums,
              dateOrRange: warningLastValue.date_unix,
              dateOfInsertionUnix: warningLastValue.date_of_insertion_unix,
              dataSources: [corona_melder_app.header.bronnen.rivm],
            }}
            referenceLink={corona_melder_app.header.reference.href}
          />

          {corona_melder_app.belangrijk_bericht &&
            !isEmpty(corona_melder_app.belangrijk_bericht) && (
              <WarningTile
                isFullWidth
                message={corona_melder_app.belangrijk_bericht}
                variant="emphasis"
              />
            )}

          <TwoKpiSection>
            <KpiTile
              title={corona_melder_app.waarschuwingen.title}
              metadata={{
                date: warningLastValue.date_unix,
                source: corona_melder_app.header.bronnen.rivm,
              }}
            >
              <KpiValue
                absolute={warningLastValue.count}
                difference={data.difference.corona_melder_app_warning__count}
                isAmount
              />

              <Markdown
                content={corona_melder_app.waarschuwingen.description}
              />
              <Text>
                {replaceComponentsInText(
                  corona_melder_app.waarschuwingen.total,
                  {
                    totalDownloads: (
                      <BoldText color="primary">
                        {formatNumber(
                          data.corona_melder_app_download.last_value.count
                        )}
                      </BoldText>
                    ),
                  }
                )}
              </Text>
            </KpiTile>

            <Tile>
              <Heading level={3}>{corona_melder_app.rapport.title}</Heading>
              <Text>{corona_melder_app.rapport.description}</Text>

              <Link href={corona_melder_app.rapport.link.href} passHref>
                <a target="_blank" css={css({ display: 'flex' })}>
                  <IconContainer>
                    <External />
                  </IconContainer>
                  <span css={css({ maxWidth: 200 })}>
                    {corona_melder_app.rapport.link.text}
                  </span>
                </a>
              </Link>
            </Tile>
          </TwoKpiSection>

          <ChartTile
            metadata={{
              source:
                corona_melder_app.waarschuwingen_over_tijd_grafiek.bronnen
                  .coronamelder,
            }}
            title={corona_melder_app.waarschuwingen_over_tijd_grafiek.title}
            description={
              corona_melder_app.waarschuwingen_over_tijd_grafiek.description
            }
            timeframeOptions={TimeframeOptionsList}
          >
            {(timeframe) => (
              <TimeSeriesChart
                accessibility={{
                  key: 'coronamelder_warned_daily_over_time_chart',
                }}
                tooltipTitle={
                  corona_melder_app.waarschuwingen_over_tijd_grafiek.title
                }
                timeframe={timeframe}
                values={data.corona_melder_app_warning.values}
                endDate={endDate}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'count',
                    label:
                      corona_melder_app.waarschuwingen_over_tijd_grafiek.labels
                        .warnings,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default CoronamelderPage;

const IconContainer = styled.span(
  css({
    marginRight: 3,
    color: 'gray',
    height: 25,
    width: 25,
  })
);
