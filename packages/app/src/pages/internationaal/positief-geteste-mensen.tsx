import {
  assert,
  colors,
  In,
  InTestedOverallValue,
} from '@corona-dashboard/common';
import { Test } from '@corona-dashboard/icons';
import { last } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { ChartTile } from '~/components/chart-tile';
import { DynamicChoropleth } from '~/components/choropleth';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { InformationTile } from '~/components/information-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { EuropeChoroplethTile } from '~/domain/international/europe-choropleth-tile';
import { InfectedTableTile } from '~/domain/international/infected-table-tile';
import {
  CountryCode,
  countryCodes,
  CountryOption,
  MultiSelectCountries,
} from '~/domain/international/multi-select-countries';
import { InPositiveTestedPeopleTooltip } from '~/domain/international/tooltip';
import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import { Languages } from '~/locale';
import {
  getArticleParts,
  getLinkParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getInData,
  getLastGeneratedDate,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { getCountryNames } from '~/static-props/utils/get-country-names';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';

type CompiledCountriesValue = {
  date_start_unix: number;
  date_end_unix: number;
} & Record<CountryCode, number>;

export const getStaticProps = withFeatureNotFoundPage(
  'inPositiveTestsPage',
  createGetStaticProps(
    ({ locale }: { locale: keyof Languages }) =>
      getLokalizeTexts(
        (siteText) => ({
          textIn: siteText.pages.in_positiveTestsPage.shared,
        }),
        locale
      ),
    getLastGeneratedDate,
    async (context: GetStaticPropsContext) => {
      const { content } = await createGetContent<
        PagePartQueryResult<ArticleParts | LinkParts>
      >(() => getPagePartsQuery('in_positiveTestsPage'))(context);
      return {
        content: {
          articles: getArticleParts(
            content.pageParts,
            'in_positiveTestsPageArticles'
          ),
          links: getLinkParts(content.pageParts, 'in_positiveTestsPageLinks'),
        },
      } as const;
    },
    createGetChoroplethData({
      in: ({ tested_overall }) => tested_overall,
    }),
    () => {
      const { internationalData } = getInData([...countryCodes])();
      const nldTestedLastValue =
        internationalData.nld.tested_overall.last_value;
      return {
        compiledInternationalData: compileInternationalData(internationalData),
        internationalMetadataDatums: {
          dateOrRange: {
            start: nldTestedLastValue.date_start_unix,
            end: nldTestedLastValue.date_end_unix,
          },
          dateOfInsertionUnix: nldTestedLastValue.date_of_insertion_unix,
        },
      };
    },
    getCountryNames
  )
);

export default function PositiefGetesteMensenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    lastGenerated,
    content,
    choropleth,
    countryNames,
    compiledInternationalData,
    internationalMetadataDatums,
  } = props;
  const { in: choroplethData } = choropleth;

  const { siteText } = useIntl();
  const { textIn } = pageText;

  const metadata = {
    ...siteText.internationaal_metadata,
    title: textIn.metadata.title,
    description: textIn.metadata.description,
  };

  const comparedCode = 'nld';
  const comparedName = countryNames[comparedCode];
  const comparedValue = choroplethData.find(
    (x) => x.country_code.toLocaleLowerCase() === comparedCode
  )?.infected_per_100k_average;

  assert(
    isDefined(comparedName),
    `[${PositiefGetesteMensenPage.name}] comparedName could not be found for country code nld`
  );
  assert(
    isDefined(comparedValue),
    `[${PositiefGetesteMensenPage.name}] comparedValue could not be found for country code nld`
  );

  const countryOptions = useMemo(
    () =>
      compileCountryOptions(
        [...countryCodes],
        countryNames,
        compiledInternationalData
      ),
    [countryNames, compiledInternationalData]
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={textIn.categorie}
            title={textIn.titel}
            icon={<Test />}
            description={textIn.pagina_toelichting}
            metadata={{
              ...internationalMetadataDatums,
              datumsText: textIn.datums,
              dataSources: [textIn.bronnen.rivm, textIn.bronnen.ecdc],
            }}
            referenceLink={textIn.reference.href}
            articles={content.articles}
            pageLinks={content.links}
          />

          <InformationTile message={textIn.informatie_tegel} />

          <EuropeChoroplethTile
            title={textIn.choropleth.titel}
            description={textIn.choropleth.toelichting}
            legend={{
              thresholds: thresholds.in.infected_per_100k_average,
              title: textIn.choropleth.legenda_titel,
            }}
            metadata={{
              dataSources: [textIn.bronnen.rivm, textIn.bronnen.ecdc],
              date: [
                internationalMetadataDatums.dateOrRange.start,
                internationalMetadataDatums.dateOrRange.end,
              ],
            }}
          >
            <DynamicChoropleth
              map="in"
              accessibility={{
                key: 'international_tested_overall_choropleth',
              }}
              data={choroplethData}
              dataConfig={{
                metricName: 'tested_overall',
                metricProperty: 'infected_per_100k_average',
              }}
              dataOptions={{
                getFeatureName: (code) =>
                  countryNames[code.toLocaleLowerCase()],
              }}
              formatTooltip={(context) => (
                <InPositiveTestedPeopleTooltip
                  title={textIn.choropleth.tooltip_titel}
                  countryName={context.featureName}
                  countryCode={context.dataItem.country_code}
                  value={context.dataItem.infected_per_100k_average}
                  comparedName={comparedName}
                  comparedCode={comparedCode}
                  comparedValue={comparedValue}
                />
              )}
              responsiveSizeConfiguration={[
                {
                  containerWidth: 600,
                  heightAndPadding: {
                    mapHeight: 650,
                    padding: { top: 5, bottom: 20 },
                  },
                },
                {
                  containerWidth: 400,
                  heightAndPadding: {
                    mapHeight: 400,
                    padding: { top: 15, bottom: 15 },
                  },
                },
                {
                  containerWidth: 300,
                  heightAndPadding: {
                    mapHeight: 300,
                    padding: { top: 5, bottom: 5 },
                  },
                },
                { mapHeight: 250, padding: { left: 20, top: 0, bottom: 0 } },
              ]}
            />
          </EuropeChoroplethTile>

          <ChartTile
            title={textIn.time_graph.title}
            metadata={{
              source: textIn.bronnen.rivm,
            }}
            description={textIn.time_graph.description}
          >
            <MultiSelectCountries
              countryOptions={countryOptions}
              limit={10}
              alwaysSelectedCodes={['nld']}
              defaultSelectedCodes={['bel', 'deu']}
            >
              {(selectedCountries, getColor) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'international_infected_people_over_time_chart',
                  }}
                  values={compiledInternationalData}
                  seriesConfig={selectedCountriesToSeriesConfig(
                    selectedCountries,
                    countryNames,
                    getColor
                  )}
                  disableLegend
                />
              )}
            </MultiSelectCountries>
          </ChartTile>

          <InfectedTableTile
            data={choroplethData}
            countryNames={countryNames}
            metadata={{
              dataSources: [textIn.bronnen.rivm, textIn.bronnen.ecdc],
              date: [
                internationalMetadataDatums.dateOrRange.start,
                internationalMetadataDatums.dateOrRange.end,
              ],
            }}
          />
        </TileList>
      </InLayout>
    </Layout>
  );
}

function compileInternationalData(data: Record<string, In>) {
  const flattenedData: CompiledCountriesValue[] = [];

  /**
   * @todo
   * For other pages, this method can accept the metricName and metricProperty
   * as arguments; combined with proper typing.
   */
  const metricName = 'tested_overall';
  const metricProperty = 'infected_per_100k_average';

  Object.entries(data).forEach(([countryCode, countryData]) => {
    countryData[metricName].values.forEach((value: InTestedOverallValue) => {
      let objectMatch = flattenedData.find(
        (o) =>
          o.date_start_unix === value.date_start_unix &&
          o.date_end_unix === value.date_end_unix
      );

      if (!isDefined(objectMatch)) {
        objectMatch = {
          date_start_unix: value.date_start_unix,
          date_end_unix: value.date_end_unix,
        } as CompiledCountriesValue;

        flattenedData.push(objectMatch);
      }

      objectMatch[countryCode as CountryCode] = value[metricProperty];
    });
  });

  const sortedData = flattenedData.sort((a, b) => {
    return a.date_start_unix - b.date_start_unix;
  });

  return sortedData;
}

function selectedCountriesToSeriesConfig(
  selectedCountries: CountryCode[],
  countryNames: Record<CountryCode, string>,
  getColor: (countryCode: CountryCode) => string
): LineSeriesDefinition<CompiledCountriesValue>[] {
  return [
    {
      type: 'line' as const,
      metricProperty: 'nld',
      label: countryNames['nld'],
      color: colors.data.neutral,
    } as LineSeriesDefinition<CompiledCountriesValue>,
  ].concat(
    selectedCountries.map((countryCode) => ({
      type: 'line' as const,
      metricProperty: countryCode,
      label: countryNames[countryCode],
      color: getColor(countryCode),
    }))
  );
}

function compileCountryOptions(
  countryCodes: CountryCode[],
  countryNames: Record<CountryCode, string>,
  data: CompiledCountriesValue[]
): CountryOption[] {
  const lastValues = last(data);

  assert(
    lastValues,
    `[${compileCountryOptions.name}] No last values available to build the country select.`
  );

  return countryCodes.map((countryCode) => {
    assert(
      lastValues[countryCode],
      `[${compileCountryOptions.name}] Country ${countryCode} has no supplied last value`
    );

    return {
      code: countryCode,
      name: countryNames[countryCode],
      lastValue: lastValues[countryCode],
    };
  });
}
