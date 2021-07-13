import { useState } from 'react';
import Getest from '~/assets/test.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { PageInformationBlock } from '~/components/page-information-block';
import { Select } from '~/components/select';
import { TileList } from '~/components/tile-list';
import { countryCodes } from '~/domain/international/select-countries';
import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { VariantsTableTile } from '~/domain/variants/variants-table-tile';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getInData,
  getLastGeneratedDate,
  getLocaleFile,
} from '~/static-props/get-data';
import { loadJsonFromDataFile } from '~/static-props/utils/load-json-from-data-file';
import { getInternationalVariantChartData } from '~/static-props/variants/get-international-variant-chart-data';
import { getInternationalVariantTableData } from '~/static-props/variants/get-international-variant-table-data';
import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import { LinkProps } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  () => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    const siteText = getLocaleFile(locale);
    const countryNames = loadJsonFromDataFile<Record<string, string>>(
      `${locale}-country-names.json`,
      'static-json'
    );
    const { internationalData } = getInData([...countryCodes])();
    const countryOptions = countryCodes.map<{ value: string; label: string }>(
      (x) => ({ value: x, label: countryNames[x] })
    );

    return {
      countryOptions,
      ...getInternationalVariantTableData(
        internationalData,
        siteText.covid_varianten.landen_van_herkomst
      ),
      ...getInternationalVariantChartData(
        internationalData,
        siteText.covid_varianten.landen_van_herkomst
      ),
    };
  },
  createGetContent<{
    page: {
      usefulLinks?: LinkProps[];
    };
    highlight: {
      articles?: ArticleSummary[];
    };
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
);

export default function VariantenPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    lastGenerated,
    content,
    variantChartData,
    variantTableData,
    countryOptions,
  } = props;
  const [tableData, setTableData] = useState<VariantRow[] | undefined>();
  const [selectedCountryCode, setSelectedCountryCode] = useState<
    string | undefined
  >();

  const intl = useIntl();
  const text = intl.siteText.internationaal_varianten;
  const tableText = text.varianten_tabel;

  const metadata = {
    ...intl.siteText.internationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <InternationalLayout lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            title={text.titel}
            icon={<Getest />}
            description={text.pagina_toelichting}
            metadata={{
              // @TODO use correct dates
              dateOrRange: { start: -999999999999, end: -99999999999 },
              dateOfInsertionUnix: -999999999999,

              datumsText: text.datums,
              dataSources: [text.bronnen.rivm],
            }}
            referenceLink={text.reference.href}
            articles={content.highlight?.articles}
            usefulLinks={content.page?.usefulLinks}
          />
          <VariantsTableTile
            source={text.bronnen.rivm}
            text={tableText}
            data={tableData}
            sampleSize={100}
            dates={{
              // @TODO use correct dates
              date_end_unix: 0,
              date_of_insertion_unix: 0,
              date_start_unix: 0,
            }}
          >
            <Box alignSelf="flex-start" my={3}>
              <Select
                options={countryOptions}
                onChange={(x) => {
                  setSelectedCountryCode(x);
                  setTableData(variantTableData[x]);
                }}
                onClear={() => setSelectedCountryCode(undefined)}
                value={selectedCountryCode}
                placeholder={'yea'}
              />
            </Box>
          </VariantsTableTile>
        </TileList>
      </InternationalLayout>
    </Layout>
  );
}
