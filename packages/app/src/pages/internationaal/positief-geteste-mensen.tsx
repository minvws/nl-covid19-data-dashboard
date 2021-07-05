import { assert, In } from '@corona-dashboard/common';
import { last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import Getest from '~/assets/test.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { EuropeChoropleth } from '~/components/choropleth/europe-choropleth';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { PositiveTestedPeopleInternationalTooltip } from '~/components/choropleth/tooltips/international/positive-tested-people-international-tooltip';
import { ContentHeader } from '~/components/content-header';
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

type CompiledCountriesValue = {
  date_start_unix: number;
  date_end_unix: number;
} & Record<CountryCode, number>;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('in_positiveTestsPage', locale);
  }),
  createGetChoroplethData({
    in: ({ tested_overall }) => tested_overall || choroplethMockData(),
  }),
  getInData(countryCodes),
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

  const comparedName = countryNames['nld'];
  const comparedValue = choropleth.in.find(
    (x) => x.country_code.toLocaleLowerCase() === 'nld'
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
    () =>
      compileInternationalData(
        internationalData,
        'tested_overall',
        'infected_per_100k_average'
      ),
    [internationalData]
  );

  const countriesAndLastValues = useMemo(
    () =>
      compileCountrySelectionData(
        countryCodes,
        countryNames,
        compiledInternationalData
      ),
    [countryNames, compiledInternationalData]
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <ContentHeader
            title={text.titel}
            icon={<Getest />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: 0, // @TODO date
              dateOfInsertionUnix: 0, // @TODO date
              dataSources: [text.bronnen.rivm],
            }}
            reference={text.reference}
          />

          {content.articles && <ArticleStrip articles={content.articles} />}

          <ChartTile
            title={'NLD vs DEU'}
            metadata={{
              source: text.source,
            }}
            description={'Who wins?'}
          >
            <>
              <SelectCountries
                countriesAndLastValues={countriesAndLastValues}
                limit={10}
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
                      accessibility={{ key: 'behavior_choropleths' }}
                      values={compiledInternationalData}
                      seriesConfig={seriesConfig}
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
                  value={context.infected_per_100k_average}
                  comparedName={comparedName}
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

function compileInternationalData(
  data: Record<string, In>,
  metricName: keyof Omit<In, 'last_generated' | 'proto_name' | 'name' | 'code'>,
  metricProperty: string
) {
  const flattenedData: CompiledCountriesValue[] = [];

  Object.entries(data).forEach(([countryCode, countryData]) => {
    countryData[metricName].values.forEach(
      (value: { date_start_unix: number; date_end_unix: number }) => {
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
      }
    );
  });

  const sortedData = flattenedData.sort((a, b) => {
    return a.date_start_unix - b.date_start_unix;
  });

  return sortedData;
}

function selectedCountriesToSeriesConfig(
  selectedCountries: CountryCode[],
  countryNames: Record<CountryCode, string>,
  colors: string[]
): LineSeriesDefinition<CompiledCountriesValue>[] {
  return [
    {
      type: 'line' as const,
      metricProperty: 'nld' as CountryCode,
      label: countryNames['nld'],
      color: 'black',
    },
  ].concat(
    selectedCountries.map((countryCode, index) => ({
      type: 'line' as const,
      metricProperty: countryCode,
      label: countryNames[countryCode],
      color: colors[index],
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
