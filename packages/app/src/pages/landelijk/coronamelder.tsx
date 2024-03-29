import { ChartTile } from '~/components/chart-tile';
import { colors } from '@corona-dashboard/common';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { Languages, SiteText } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { PageInformationBlock } from '~/components/page-information-block';
import { Phone } from '@corona-dashboard/icons';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils';
import { WarningTile } from '~/components/warning-tile';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.behavior_page.nl,
  jsonText: siteText.common.common.metadata.metrics_json_links,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('corona_melder_app_warning_archived_20220421', 'corona_melder_app_download_archived_20220421')
);

const CoronamelderPage = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();

  const reverseRouter = useReverseRouter();

  const { pageText, selectedArchivedNlData: data, lastGenerated } = props;
  const { corona_melder_app } = commonTexts;
  const { metadataTexts, textNl, jsonText } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const warningLastValue = data.corona_melder_app_warning_archived_20220421.last_value;
  const endDate = createDateFromUnixTimestamp(warningLastValue.date_unix);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const metadataTimeframePeriod = {
    start: data.corona_melder_app_warning_archived_20220421.values[0].date_unix,
    end: data.corona_melder_app_warning_archived_20220421.values[data.corona_melder_app_warning_archived_20220421.values.length - 1].date_unix,
  };

  const hasActiveWarningTile = !!corona_melder_app.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            title={corona_melder_app.header.title}
            icon={<Phone aria-hidden="true" />}
            description={corona_melder_app.header.description}
            metadata={{
              datumsText: corona_melder_app.header.datums,
              dateOrRange: warningLastValue.date_unix,
              dateOfInsertion: warningLastValue.date_of_insertion_unix,
              dataSources: [corona_melder_app.header.bronnen.rivm],
              jsonSources: [{ href: reverseRouter.json.archivedNational(), text: jsonText.metrics_archived_national_json.text }],
            }}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={corona_melder_app.belangrijk_bericht} variant="informational" />}

          <ChartTile
            metadata={{
              timeframePeriod: metadataTimeframePeriod,
              dateOfInsertion: getLastInsertionDateOfPage(data, ['corona_melder_app_warning_archived_20220421']),
              source: corona_melder_app.waarschuwingen_over_tijd_grafiek.bronnen.coronamelder,
              isArchived: true,
            }}
            title={corona_melder_app.waarschuwingen_over_tijd_grafiek.title}
            description={corona_melder_app.waarschuwingen_over_tijd_grafiek.description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'coronamelder_warned_daily_over_time_chart',
              }}
              tooltipTitle={corona_melder_app.waarschuwingen_over_tijd_grafiek.title}
              values={data.corona_melder_app_warning_archived_20220421.values}
              endDate={endDate}
              seriesConfig={[
                {
                  type: 'area',
                  metricProperty: 'count',
                  label: corona_melder_app.waarschuwingen_over_tijd_grafiek.labels.warnings,
                  color: colors.primary,
                },
              ]}
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default CoronamelderPage;
