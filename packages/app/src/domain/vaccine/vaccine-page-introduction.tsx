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
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import {
  DecoratedLink as CMSDecoratedLink,
  TitleDescriptionBlock,
} from '~/types/cms';
import { createDate } from '~/utils/create-date';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { VaccineTicker } from './components/vaccine-ticker';
import { VaccineAdministrationsOverTimeChart } from './vaccine-administrations-over-time-chart';
interface VaccinePageIntroductionProps {
  data: Pick<
    National,
    | 'vaccine_administered_planned'
    | 'vaccine_administered_total'
    | 'vaccine_administered_rate_moving_average'
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
  const { siteText, formatPercentage, formatDate } = useIntl();

  const text = siteText.vaccinaties;

  const roundedMillion =
    Math.floor(
      (data.vaccine_administered_total.last_value.estimated / 1_000_000) * 10
    ) / 10;

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
            <Text fontSize="1.625rem" m={0}>
              {replaceComponentsInText(
                text.current_amount_of_administrations_text,
                {
                  amount: (
                    <InlineText color="data.primary" fontWeight="bold">
                      {formatPercentage(roundedMillion)}{' '}
                      {siteText.common.miljoen}
                    </InlineText>
                  ),
                }
              )}
            </Text>

            <TwoKpiSection spacing={4}>
              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.grafiek_gezette_prikken.titel}
                </Heading>
                <Text m={0}>{text.grafiek_gezette_prikken.omschrijving}</Text>
                <div css={css({ position: 'relative' })}>
                  <VaccineAdministrationsOverTimeChart
                    title={text.grafiek_gezette_prikken.titel}
                    values={data.vaccine_administered_total.values}
                  />
                </div>
              </Box>

              <Box as="article" spacing={3}>
                <Heading level={3}>
                  {text.kpi_geplande_prikken_deze_week.titel}
                </Heading>
                <KpiValue
                  absolute={data.vaccine_administered_planned.last_value.doses}
                />
                <Text m={0}>
                  {(() => {
                    /**
                     * We'll render a date range either as:
                     *
                     * "1 tot en met 7 maart" (same month)
                     *
                     * or:
                     *
                     * "29 maart tot en met 4 april" (overlapping month)
                     *
                     */

                    const dateFrom = createDate(
                      data.vaccine_administered_planned.last_value
                        .date_start_unix
                    );
                    const dateTo = createDate(
                      data.vaccine_administered_planned.last_value.date_end_unix
                    );

                    const isSameMonth =
                      dateFrom.getMonth() === dateTo.getMonth();

                    const dateFromText = isSameMonth
                      ? dateFrom.getDate()
                      : formatDate(dateFrom);
                    const dateToText = formatDate(dateTo);

                    return replaceComponentsInText(
                      text.kpi_geplande_prikken_deze_week.omschrijving,
                      {
                        date_from: dateFromText,
                        date_to: dateToText,
                      }
                    );
                  })()}
                </Text>
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
