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
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.vaccinaties;

const VaccinationPage: FCWithLayout<NationalPageProps> = (props) => {
  return (
    <>
      {' '}
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          title={text.section_vaccinations_rivm.title}
          icon={<VaccinatieIcon />}
          subtitle={text.section_vaccinations_rivm.description}
          reference={text.section_vaccinations_rivm.reference}
          metadata={{
            datumsText: text.section_vaccinations_rivm.datums,
            dateInfo: parseFloat(text.date_of_report_unix),
            dateOfInsertionUnix: parseFloat(text.date_of_insertion_unix),
            dataSources: [text.section_vaccinations_rivm.bronnen.rivm, text.section_vaccinations_rivm.bronnen.vws],
          }}
        />
        <TwoKpiSection>
          <KpiTile
            title={text.section_vaccinations_rivm.kpi_first_vaccinations.title}
            metadata={{ date: parseFloat(text.date_of_report_unix), source: text.section_vaccinations_rivm.bronnen.rivm}}
          >
            <KpiValue absolute={parseFloat(text.section_vaccinations_rivm.kpi_first_vaccinations.value)}/>
            <Text mb={'1.5rem'}>{text.section_vaccinations_rivm.kpi_first_vaccinations.description}</Text>

            <Heading level={3}>{text.section_vaccinations_rivm.kpi_rate.title}</Heading>
            <KpiValue percentage={parseFloat(text.section_vaccinations_rivm.kpi_rate.value)}/>
            <Text
              my={0}
              color="annotation"
              fontSize={1}>
              {text.section_vaccinations_rivm.kpi_rate.target}
            </Text>
            <Text>{text.section_vaccinations_rivm.kpi_rate.description}</Text>
          </KpiTile>
           
          <KpiTile
            title={text.section_vaccinations_rivm.kpi_stock.title}
            metadata={{ date: parseFloat(text.date_of_report_unix), source: text.section_vaccinations_rivm.bronnen.vws}}
          >
            <KpiValue absolute={parseFloat(text.section_vaccinations_rivm.kpi_stock.value)}/>
            <Text mb={'1.5rem'}>{text.section_vaccinations_rivm.kpi_stock.description}</Text>

            <Heading level={3}>{text.section_vaccinations_rivm.kpi_expected_delivery.title}</Heading>
            <KpiValue absolute={parseFloat(text.section_vaccinations_rivm.kpi_expected_delivery.value)}/>
            <Text>{text.section_vaccinations_rivm.kpi_expected_delivery.description}</Text>
          </KpiTile>
        </TwoKpiSection>

        <KpiTile title={text.section_vaccinations_more_information.title} metadata={{}}>
          <Text
              as="div"
              dangerouslySetInnerHTML={{
                __html: props.text.vaccinaties.section_vaccinations_more_information.description,
              }}
            />
          </KpiTile>
      </TileList>
    </>
  )
}

VaccinationPage.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default VaccinationPage;
