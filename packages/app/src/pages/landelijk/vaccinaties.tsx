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
import { SEOHead } from '~/components-styled/seo-head';
import { css } from '@styled-system/css';
import { formatNumber } from '~/utils/formatNumber';
import styled from 'styled-components';

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
            dateOrRange: parseFloat(text.date_of_insertion_unix),
            dateOfInsertionUnix: parseFloat(text.date_of_insertion_unix),
            dataSources: [text.bronnen.rivm],
          }}
        />
        <TwoKpiSection>
          <KpiTile
            title={text.data.kpi_total.title}
            metadata={{
              date: parseFloat(text.data.kpi_total.date_of_report_unix),
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue absolute={parseFloat(text.data.kpi_total.value)} />
            <Text mb={3}>{text.data.kpi_total.description}</Text>
            {text.data.kpi_total.administered.map((item) => (
              <>
                <Heading level={4} fontSize={'1.1em'} mt={3} mb={0}>
                  <span css={css({ color: 'data.primary' })}>
                    {formatNumber(parseFloat(item.value))}
                  </span>
                  {` ${item.description}`}
                </Heading>
              </>
            ))}
          </KpiTile>

          <KpiTile
            title={text.data.kpi_expected_delivery.title}
            metadata={{
              date: parseFloat(
                text.data.kpi_expected_delivery.date_of_report_unix
              ),
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue text={text.data.kpi_expected_delivery.value} />
            <Text mb={4}>{text.data.kpi_expected_delivery.description}</Text>
            <Heading level={3}>
              {text.section_vaccinations_more_information.title}
            </Heading>
            <Text
              mb={0}
              as={StyledParagraph}
              dangerouslySetInnerHTML={{
                __html: text.section_vaccinations_more_information.description,
              }}
            />
          </KpiTile>
        </TwoKpiSection>
      </TileList>
    </>
  );
};

const StyledParagraph = styled.div(
  css({
    p: {
      marginBottom: 0,
    },
    ul: {
      marginTop: 0,
      paddingLeft: '1.2rem',
    },
  })
);

VaccinationPage.getLayout = getNationalLayout;

export default VaccinationPage;
