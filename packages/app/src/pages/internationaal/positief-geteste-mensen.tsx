import { assert, In, InTestedOverallValue } from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { PositiveTestedPeopleInternationalTooltip } from '~/components/choropleth/tooltips/international/positive-tested-people-international-tooltip';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { EuropeChoroplethTile } from '~/domain/internationaal/europe-choropleth-tile';
import { choroplethMockData } from '~/domain/internationaal/logic/choropleth-mock-data';
import { Country } from '~/domain/international/select-countries/context';
import {
  CountryCode,
  countryCodes,
} from '~/domain/international/select-countries/country-code';
import { SelectCountries } from '~/domain/international/select-countries/select-countries';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { getInPositiveTestsQuery } from '~/queries/in-positive-tests-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getInData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { getCountryNames } from '~/static-props/utils/get-country-names';
import { colors } from '~/style/theme';
import { InPositiveTestsQuery } from '~/types/cms';

type CompiledCountriesValue = {
  date_start_unix: number;
  date_end_unix: number;
} & Record<CountryCode, number>;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    page: InPositiveTestsQuery;
    highlight: {
      articles?: ArticleSummary[];
    };
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return `{
      "page": ${getInPositiveTestsQuery()},
      "highlight": ${createPageArticlesQuery('in_positiveTestsPage', locale)}
    }`;
  }),
  createGetChoroplethData({
    in: ({ tested_overall }) => tested_overall || choroplethMockData(),
  }),
  getInData([...countryCodes]),
  getCountryNames
);

export default function PositiefGetesteMensenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    lastGenerated,
    content,
    choropleth,
    countryNames,
    internationalData,
  } = props;
  const { in: choroplethData } = choropleth;

  const intl = useIntl();
  const text = intl.siteText.internationaal_positief_geteste_personen;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const comparedCode = 'nld';
  const comparedName = countryNames[comparedCode];
  const comparedValue = choropleth.in.find(
    (x) => x.country_code.toLocaleLowerCase() === comparedCode
  )?.infected_per_100k_average;

  assert(
    isDefined(comparedName),
    'comparedName could not be found for country code nld'
  );
  assert(
    isDefined(comparedValue),
    'comparedValue could not be found for country code nld'
  );

  const compiledInternationalData = useMemo(
    () => compileInternationalData(internationalData),
    [internationalData]
  );

  const countriesAndLastValues = useMemo(
    () =>
      compileCountrySelectionData(
        [...countryCodes],
        countryNames,
        compiledInternationalData
      ),
    [countryNames, compiledInternationalData]
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: 0, // @TODO date
              dateOfInsertionUnix: 0, // @TODO date
              dataSources: [
                text.bronnen.rivm,
                text.bronnen.our_world_in_data,
                text.bronnen.ecdc,
              ],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
            usefulLinks={content.page.usefulLinks}
          />

          <ChartTile
            title={text.time_graph.title}
            metadata={{
              source: text.bronnen.rivm,
            }}
            description={text.time_graph.description}
          >
            <>
              <SelectCountries
                countriesAndLastValues={countriesAndLastValues}
                limit={10}
                alwaysSelected={['nld']}
              >
                {(selectedCountries, colors) => {
                  const seriesConfig: LineSeriesDefinition<CompiledCountriesValue>[] =
                    selectedCountriesToSeriesConfig(
                      selectedCountries,
                      countryNames,
                      colors
                    );
                  return (
                    <TimeSeriesChart
                      accessibility={{
                        key: 'international_infected_people_over_time_chart',
                      }}
                      values={compiledInternationalData}
                      seriesConfig={seriesConfig}
                      disableLegend
                    />
                  );
                }}
              </SelectCountries>
            </>
          </ChartTile>

          <EuropeChoroplethTile
            title={text.choropleth.titel}
            description={text.choropleth.toelichting}
            legend={{
              thresholds: internationalThresholds.infected_per_100k_average,
              title: text.choropleth.legenda_titel,
            }}
            metadata={{
              source: text.bronnen.rivm,
            }}
          >
            <EuropeChoropleth
              accessibility={{
                key: 'international_tested_overall_choropleth',
              }}
              data={choroplethData}
              metricProperty="infected_per_100k_average"
              tooltipContent={(context) => (
                <PositiveTestedPeopleInternationalTooltip
                  title={text.choropleth.tooltip_titel}
                  countryName={
                    countryNames[context.country_code.toLowerCase()] ||
                    context.country_code
                  }
                  countryCode={context.country_code}
                  value={context.infected_per_100k_average}
                  comparedName={comparedName}
                  comparedCode={comparedCode}
                  comparedValue={comparedValue}
                />
              )}
            />
          </EuropeChoroplethTile>
        </TileList>
      </InternationalLayout>
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
  selectionColors: string[]
): LineSeriesDefinition<CompiledCountriesValue>[] {
  return [
    {
      type: 'line' as const,
      metricProperty: 'nld' as CountryCode,
      label: countryNames['nld'],
      color: colors.data.neutral,
    } as LineSeriesDefinition<CompiledCountriesValue>,
  ].concat(
    selectedCountries.map((countryCode, index) => ({
      type: 'line' as const,
      metricProperty: countryCode,
      label: countryNames[countryCode],
      color: selectionColors[index],
    }))
  );
}

function compileCountrySelectionData(
  countryCodes: CountryCode[],
  countryNames: Record<CountryCode, string>,
  data: CompiledCountriesValue[]
): Country[] {
  const lastValues = last(data);
  return countryCodes.map((countryCode) => ({
    code: countryCode,
    name: countryNames[countryCode],
    lastValue: lastValues?.[countryCode] ?? 0,
  }));
}
