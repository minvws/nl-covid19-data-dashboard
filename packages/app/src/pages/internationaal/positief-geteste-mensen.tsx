import { assert, In, InTestedOverallValue } from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { InChoropleth } from '~/components/choropleth';
import { inThresholds } from '~/components/choropleth/logic';
import { InPositiveTestedPeopleTooltip } from '~/components/choropleth/tooltips';
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
  SelectCountries,
} from '~/domain/international/select-countries';
import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
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

export const getStaticProps = withFeatureNotFoundPage(
  'inPositiveTestsPage',
  createGetStaticProps(
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
    lastGenerated,
    content,
    choropleth,
    countryNames,
    compiledInternationalData,
    internationalMetadataDatums,
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
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              ...internationalMetadataDatums,
              datumsText: text.datums,
              dataSources: [text.bronnen.rivm, text.bronnen.ecdc],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight.articles}
            usefulLinks={content.page.usefulLinks}
          />

          <InformationTile message={text.informatie_tegel} />

          <EuropeChoroplethTile
            title={text.choropleth.titel}
            description={text.choropleth.toelichting}
            legend={{
              thresholds: inThresholds.infected_per_100k_average,
              title: text.choropleth.legenda_titel,
            }}
            metadata={{
              dataSources: [text.bronnen.rivm, text.bronnen.ecdc],
              date: [
                internationalMetadataDatums.dateOrRange.start,
                internationalMetadataDatums.dateOrRange.end,
              ],
            }}
          >
            <InChoropleth
              accessibility={{
                key: 'international_tested_overall_choropleth',
              }}
              data={choroplethData}
              metricProperty="infected_per_100k_average"
              tooltipContent={(context) => (
                <InPositiveTestedPeopleTooltip
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

          <ChartTile
            title={text.time_graph.title}
            metadata={{
              source: text.bronnen.rivm,
            }}
            description={text.time_graph.description}
          >
            <SelectCountries
              countryOptions={countryOptions}
              limit={10}
              alwaysSelectedCodes={['nld']}
              defaultSelectedCodes={['bel', 'deu']}
            >
              {(selectedCountries, colors) => (
                <TimeSeriesChart
                  accessibility={{
                    key: 'international_infected_people_over_time_chart',
                  }}
                  values={compiledInternationalData}
                  seriesConfig={selectedCountriesToSeriesConfig(
                    selectedCountries,
                    countryNames,
                    colors
                  )}
                  disableLegend
                />
              )}
            </SelectCountries>
          </ChartTile>

          <InfectedTableTile
            data={choroplethData}
            countryNames={countryNames}
            metadata={{
              dataSources: [text.bronnen.rivm, text.bronnen.ecdc],
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
  selectionColors: string[]
): LineSeriesDefinition<CompiledCountriesValue>[] {
  return [
    {
      type: 'line' as const,
      metricProperty: 'nld',
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

function compileCountryOptions(
  countryCodes: CountryCode[],
  countryNames: Record<CountryCode, string>,
  data: CompiledCountriesValue[]
): CountryOption[] {
  const lastValues = last(data);

  assert(lastValues, 'No last values available to build the country select.');

  return countryCodes.map((countryCode) => {
    assert(
      lastValues[countryCode],
      `Country ${countryCode} has no supplied last value`
    );

    return {
      code: countryCode,
      name: countryNames[countryCode],
      lastValue: lastValues[countryCode],
    };
  });
}
