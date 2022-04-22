import { Test } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useCallback, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InformationTile } from '~/components/information-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { WarningTile } from '~/components/warning-tile';
import { countryCodes } from '~/domain/international/multi-select-countries';
import { SelectCountry } from '~/domain/international/select-country';
import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import {
  getInternationalVariantChartData,
  getInternationalVariantTableData,
  VariantChartData,
  VariantTableData,
} from '~/domain/variants/static-props';
import { VariantsStackedAreaTile } from '~/domain/variants/variants-stacked-area-tile';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
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
  createGetContent,
  getInData,
  getLastGeneratedDate,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { loadJsonFromDataFile } from '~/static-props/utils/load-json-from-data-file';
import { ArticleParts, LinkParts, PagePartQueryResult } from '~/types/cms';

export const getStaticProps = withFeatureNotFoundPage(
  'inVariantsPage',
  createGetStaticProps(
    ({ locale }: { locale: keyof Languages }) =>
      getLokalizeTexts(
        (siteText) => ({
          textNl: siteText.pages.variantsPage.nl,
          textShared: siteText.pages.in_variantsPage.shared,
        }),
        locale
      ),
    getLastGeneratedDate,
    (context) => {
      const { locale } = context;
      const countryNames = loadJsonFromDataFile<Record<string, string>>(
        `${locale}-country-names.json`,
        'static-json'
      );
      const { internationalData } = getInData([...countryCodes])();
      const countryOptions = countryCodes
        .map<{ value: string; label: string }>((x) => ({
          value: x,
          label: countryNames[x],
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      return {
        countryOptions,
        ...getInternationalVariantTableData(internationalData),
        ...getInternationalVariantChartData(internationalData),
      };
    },
    async (context: GetStaticPropsContext) => {
      const { content } = await createGetContent<
        PagePartQueryResult<ArticleParts | LinkParts>
      >(() => getPagePartsQuery('in_variantsPage'))(context);

      return {
        content: {
          articles: getArticleParts(
            content.pageParts,
            'in_variantsPageArticles'
          ),
          links: getLinkParts(content.pageParts, 'in_variantsPageLinks'),
        },
      };
    }
  )
);

export default function VariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    lastGenerated,
    content,
    variantTableData,
    variantChartData,
    countryOptions,
  } = props;
  const defaultCountryCode = countryOptions[0].value;
  const [tableData, setTableData] = useState<VariantTableData>(
    variantTableData[defaultCountryCode]
  );
  const [chartData, setChartData] = useState<VariantChartData>(
    variantChartData[defaultCountryCode]
  );
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>(defaultCountryCode);

  const { commonTexts } = useIntl();
  const { textNl, textShared } = pageText;

  const metadata = {
    ...commonTexts.internationaal_metadata,
    title: textShared.metadata.title,
    description: textShared.metadata.description,
  };

  const noDataMessageTable =
    tableData?.variantTable === undefined
      ? textShared.selecteer_een_land_omschrijving
      : tableData?.variantTable === null
      ? textShared.geen_data_omschrijving
      : '';

  const noDataMessageChart =
    chartData?.variantChart === undefined
      ? textShared.selecteer_een_land_omschrijving
      : chartData?.variantChart === null
      ? textShared.geen_data_omschrijving
      : '';

  const onChange = useCallback(
    (value: string) => {
      setSelectedCountryCode(value);
      setTableData(variantTableData[value]);
      setChartData(variantChartData[value]);
    },
    [
      setSelectedCountryCode,
      setTableData,
      setChartData,
      variantTableData,
      variantChartData,
    ]
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={textShared.categorie}
            title={textShared.titel}
            icon={<Test />}
            description={textShared.pagina_toelichting}
            metadata={{
              dateOrRange: {
                start: tableData?.dates?.date_start_unix ?? 0,
                end: tableData?.dates?.date_end_unix ?? 0,
              },
              dateOfInsertionUnix:
                tableData?.dates?.date_of_insertion_unix ?? 0,

              datumsText: textShared.datums,
              dataSources: [textShared.bronnen.rivm],
            }}
            referenceLink={textShared.reference.href}
            articles={content.articles}
            pageLinks={content.links}
          />

          <InformationTile message={textShared.informatie_tegel} />

          <VariantsTableTile
            noDataMessage={noDataMessageTable}
            source={textShared.bronnen.rivm}
            text={{
              ...textShared.varianten_tabel,
              varianten: commonTexts.variants,
              description: textNl.varianten_omschrijving,
            }}
            data={tableData?.variantTable}
            sampleSize={tableData?.sampleSize ?? 0}
            dates={tableData?.dates}
          >
            <Box
              alignSelf="flex-start"
              display="flex"
              alignItems={{ _: 'flex-start', md: 'center' }}
              flexDirection={{ _: 'column', md: 'row' }}
              spacing={{ _: 4, md: 0 }}
              spacingHorizontal={{ md: 3 }}
            >
              <SelectCountry
                options={countryOptions}
                onChange={onChange}
                value={selectedCountryCode}
              />

              {isPresent(tableData?.variantTable) && !tableData?.isReliable && (
                <WarningTile
                  message={textShared.lagere_betrouwbaarheid}
                  variant="emphasis"
                  tooltipText={textShared.lagere_betrouwbaarheid_uitleg}
                />
              )}
            </Box>
          </VariantsTableTile>

          <VariantsStackedAreaTile
            text={{
              ...textShared.varianten_over_tijd_grafiek,
              varianten: commonTexts.variants,
            }}
            noDataMessage={noDataMessageChart}
            values={chartData?.variantChart}
            metadata={{
              dataSources: [textShared.bronnen.rivm],
            }}
          >
            <Box alignSelf="flex-start">
              <SelectCountry
                options={countryOptions}
                onChange={onChange}
                value={selectedCountryCode}
              />
            </Box>
          </VariantsStackedAreaTile>
        </TileList>
      </InLayout>
    </Layout>
  );
}
