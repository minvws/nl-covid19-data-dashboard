import css from '@styled-system/css';
import { useCallback, useState } from 'react';
import styled from 'styled-components/';
import { isPresent } from 'ts-is-present';
import Getest from '~/assets/test.svg';
import { Box } from '~/components/base';
import { InformationTile } from '~/components/information-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { Select } from '~/components/select';
import { TileList } from '~/components/tile-list';
import { WarningTile } from '~/components/warning-tile';
import { countryCodes } from '~/domain/international/select-countries';
import { VariantsStackedAreaTile } from '~/domain/international/variants-stacked-area-tile';
import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import {
  getInternationalVariantChartData,
  getInternationalVariantTableData,
  VariantChartData,
  VariantTableData,
} from '~/domain/variants/static-props';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getInData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { loadJsonFromDataFile } from '~/static-props/utils/load-json-from-data-file';
import { LinkProps } from '~/types/cms';
export const getStaticProps = withFeatureNotFoundPage(
  'inVariantsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    () => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
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
    createGetContent<{
      page: {
        usefulLinks?: LinkProps[];
      };
      highlight: PageArticlesQueryResult;
    }>(() => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      return `{
        "page": *[_type=='in_variantsPage']{
          "usefulLinks": [...pageLinks[]{
            "title": title.${locale},
            "href": href,
          }]
        }[0],
        "highlight": ${createPageArticlesQuery('in_variantsPage', locale)}
    }`;
    })
  )
);

export default function VariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
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

  const intl = useIntl();
  const text = intl.siteText.internationaal_varianten;
  const tableText = text.varianten_tabel;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const noDataMessageTable =
    tableData?.variantTable === undefined
      ? text.selecteer_een_land_omschrijving
      : tableData?.variantTable === null
      ? text.geen_data_omschrijving
      : '';

  const noDataMessageChart =
    chartData?.variantChart === undefined
      ? text.selecteer_een_land_omschrijving
      : chartData?.variantChart === null
      ? text.geen_data_omschrijving
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
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              dateOrRange: {
                start: tableData?.dates?.date_start_unix ?? 0,
                end: tableData?.dates?.date_end_unix ?? 0,
              },
              dateOfInsertionUnix:
                tableData?.dates?.date_of_insertion_unix ?? 0,

              datumsText: text.datums,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight?.articles}
            usefulLinks={content.page?.usefulLinks}
          />

          <InformationTile message={text.informatie_tegel} />

          <VariantsTableTile
            noDataMessage={noDataMessageTable}
            source={text.bronnen.rivm}
            text={tableText}
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
              <Select
                options={countryOptions}
                onChange={onChange}
                value={selectedCountryCode}
                icon={
                  <FlagImage
                    aria-hidden
                    src={`/icons/flags/${selectedCountryCode.toLowerCase()}.svg`}
                    width="16"
                    height="12"
                    alt=""
                  />
                }
              />

              {isPresent(tableData?.variantTable) && !tableData?.isReliable && (
                <WarningTile
                  message={text.lagere_betrouwbaarheid}
                  variant="emphasis"
                  tooltipText={text.lagere_betrouwbaarheid_uitleg}
                />
              )}
            </Box>
          </VariantsTableTile>

          <VariantsStackedAreaTile
            noDataMessage={noDataMessageChart}
            values={chartData?.variantChart}
            metadata={{
              dataSources: [text.bronnen.rivm],
            }}
          >
            <Box alignSelf="flex-start">
              <Select
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

export const FlagImage = styled.img(
  css({
    display: 'block',
    ml: 1,
  })
);
