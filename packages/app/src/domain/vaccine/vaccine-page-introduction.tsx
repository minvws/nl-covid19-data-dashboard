import { National } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Metadata } from '~/components/content-header/metadata';
import { DecoratedLink } from '~/components/decorated-link';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import {
  DecoratedLink as CMSDecoratedLink,
  TitleDescriptionBlock,
} from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VaccineTicker } from './components/vaccine-ticker';
import { VaccineAdministrationsOverTimeChart } from './vaccine-administrations-over-time-chart';
interface VaccinePageIntroductionProps {
  data: Pick<
    National,
    | 'vaccine_administered_planned'
    | 'vaccine_administered_total'
    | 'vaccine_administered_rate_moving_average'
    | 'vaccine_coverage'
  >;
  pageInfo: TitleDescriptionBlock;
  pageLinks: CMSDecoratedLink[];
  pageLinksTitle: string;
}

export function VaccinePageIntroduction({
  data,
  pageInfo,
  pageLinks,
  pageLinksTitle,
}: VaccinePageIntroductionProps) {
  const { siteText, formatPercentage, formatDateSpan } = useIntl();

  const text = siteText.vaccinaties;

  const roundedMillion =
    Math.floor(
      (data.vaccine_administered_total.last_value.estimated / 1_000_000) * 10
    ) / 10;

  const [
    vaccineAdministeredStartDate,
    vaccineAdministeredEndDate,
  ] = formatDateSpan(
    {
      seconds: data.vaccine_administered_planned.last_value.date_start_unix,
    },
    {
      seconds: data.vaccine_administered_planned.last_value.date_end_unix,
    }
  );

  return (
    <Box spacing={4}>
      <Tile>
        <Box spacing={3}>
          <HeadingWithIcon
            icon={<VaccinatieIcon />}
            title={text.title}
            headingLevel={1}
          />
          <Box spacing={4} px={{ md: 5 }}>
            <TwoKpiSection spacing={4}>
              <Text fontSize="1.625rem" m={0}>
                {replaceComponentsInText(
                  text.current_amount_of_administrations_text,
                  {
                    amount: (
                      <InlineText fontWeight="bold">
                        {formatPercentage(roundedMillion)}{' '}
                        {siteText.common.miljoen}
                      </InlineText>
                    ),
                  }
                )}
              </Text>

              <Box as="article">
                <VaccineAdministrationsOverTimeChart
                  title={text.grafiek_gezette_prikken.titel}
                  values={data.vaccine_administered_total.values}
                />
              </Box>
            </TwoKpiSection>

            <TwoKpiSection spacing={4}>
              {data.vaccine_coverage && (
                <Box as="article" spacing={3}>
                  <Heading level={3}>{text.kpi_vaccinatiegraad.titel}</Heading>
                  <KpiValue
                    percentage={
                      data.vaccine_coverage.last_value
                        .fully_vaccinated_percentage
                    }
                  />
                  <Markdown content={text.kpi_vaccinatiegraad.omschrijving} />
                </Box>
              )}
              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.kpi_geplande_prikken_deze_week.titel}
                </Heading>
                <KpiValue
                  absolute={data.vaccine_administered_planned.last_value.doses}
                />
                <Markdown
                  content={replaceVariablesInText(
                    text.kpi_geplande_prikken_deze_week.omschrijving,
                    {
                      date_from: vaccineAdministeredStartDate,
                      date_to: vaccineAdministeredEndDate,
                    }
                  )}
                />
              </Box>
            </TwoKpiSection>

            <VaccineTicker
              data={data.vaccine_administered_rate_moving_average.last_value}
            />
          </Box>
        </Box>
      </Tile>

      <TwoKpiSection>
        <Box>
          <Heading level={3}>{pageInfo.title}</Heading>
          <Tile>
            <RichContent blocks={pageInfo.description} />
            <Box display="flex">
              <MetadataBox>
                <Metadata
                  datumsText={text.datums}
                  dateOrRange={
                    data.vaccine_administered_total.last_value.date_unix
                  }
                  dateOfInsertionUnix={
                    data.vaccine_administered_total.last_value
                      .date_of_insertion_unix
                  }
                  dataSources={[]}
                  moreInformationLabel={text.more_information.label}
                  moreInformationLink={text.more_information.link}
                  accessibilitySubject={''}
                />
              </MetadataBox>
            </Box>
          </Tile>
        </Box>
        <Box>
          <Heading level={3}>{pageLinksTitle}</Heading>
          <DecoratedLinksTile>
            <Box>
              {pageLinks.map((x, index) => (
                <DecoratedLink link={x} compact={index > 0} key={index} />
              ))}
            </Box>
          </DecoratedLinksTile>
        </Box>
      </TwoKpiSection>
    </Box>
  );
}

const MetadataBox = styled.div(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
  })
);

const DecoratedLinksTile = styled.article(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'white',
    p: 0,
    borderRadius: 1,
    boxShadow: 'tile',
  })
);
