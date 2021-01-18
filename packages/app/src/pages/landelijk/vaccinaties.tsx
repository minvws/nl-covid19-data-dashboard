import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { SEOHead } from '~/components/seoHead';
import {
  getNlData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  getText
);

const VaccinationPage: FCWithLayout<typeof getStaticProps> = ({
  text: siteText,
}) => {
  const text = siteText.vaccinaties;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          title={text.title}
          icon={<VaccinatieIcon />}
          subtitle={text.description}
          reference={text.reference}
          metadata={{
            datumsText: text.datums,
            dateOrRange: parseFloat(text.data.date_of_insertion_unix),
            dateOfInsertionUnix: parseFloat(text.data.date_of_insertion_unix),
            dataSources: [text.bronnen.rivm, text.bronnen.vws],
          }}
        />
        <TwoKpiSection>
          <KpiTile
            title={text.data.kpi_first_vaccinations.title}
            metadata={{
              date: parseFloat(text.data.date_of_report_unix),
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              absolute={parseFloat(text.data.kpi_first_vaccinations.value)}
            />
            <Text mb={4}>{text.data.kpi_first_vaccinations.description}</Text>

            <Heading level={3}>{text.data.kpi_rate.title}</Heading>
            <KpiValue percentage={parseFloat(text.data.kpi_rate.value)} />
            <Text my={0} color="annotation" fontSize={1}>
              {text.data.kpi_rate.target}
            </Text>
            <Text>{text.data.kpi_rate.description}</Text>
          </KpiTile>

          <KpiTile
            title={text.data.kpi_stock.title}
            metadata={{
              date: parseFloat(text.data.date_of_report_unix),
              source: text.bronnen.vws,
            }}
          >
            <KpiValue absolute={parseFloat(text.data.kpi_stock.value)} />
            <Text mb={4}>{text.data.kpi_stock.description}</Text>

            <Heading level={3}>{text.data.kpi_expected_delivery.title}</Heading>
            <KpiValue
              absolute={parseFloat(text.data.kpi_expected_delivery.value)}
            />
            <Text>{text.data.kpi_expected_delivery.description}</Text>
          </KpiTile>
        </TwoKpiSection>

        <KpiTile
          title={text.section_vaccinations_more_information.title}
          metadata={{}}
        >
          <Text
            as="div"
            dangerouslySetInnerHTML={{
              __html: text.section_vaccinations_more_information.description,
            }}
          />
        </KpiTile>
      </TileList>
    </>
  );
};

VaccinationPage.getLayout = getNationalLayout;

export default VaccinationPage;
