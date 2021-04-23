import { National } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { ContentHeader } from '~/components/content-header';
import { Metadata } from '~/components/content-header/metadata';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import { KpiValue } from '~/components/kpi-value';
import { Tile } from '~/components/tile';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { DecoratedLink, TitleDescriptionBlock } from '~/types/cms';
import { createDate } from '~/utils/create-date';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { VaccineTicker } from './components/vaccine-ticker';
import { VaccineAdministrationsOverTimeChart } from './vaccine-administrations-over-time-chart';
interface VaccinePageIntroductionProps {
  data: National;
  pageInfo: TitleDescriptionBlock;
  pageLinks: DecoratedLink[];
}

export function VaccinePageIntroduction({
  data,
  pageInfo,
  pageLinks,
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
                <VaccineAdministrationsOverTimeChart
                  title={text.grafiek_gezette_prikken.titel}
                  values={data.vaccine_administered_total.values}
                />
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
            <Box
              spacing={{ _: 3, md: 0 }}
              display="flex"
              flexDirection={['column', null, null, null, 'row']}
              ml={[null, null, null, false ? 5 : null]}
            >
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
          <Heading level={3}>Ook Interessant</Heading>
          <LinksTile>
            <Box spacing={3}>
              {pageLinks.map((l, index) => (
                <DecoratedLinkView link={l} compact={index > 0} />
              ))}
            </Box>
          </LinksTile>
        </Box>
      </TwoKpiSection>

      <Box px={{ _: 3, sm: 4 }}>
        <ContentHeader
          subtitle={text.description}
          reference={text.reference}
          metadata={{
            datumsText: text.datums,
            dateOrRange: data.vaccine_administered_total.last_value.date_unix,
            dateOfInsertionUnix:
              data.vaccine_administered_total.last_value.date_of_insertion_unix,
            dataSources: [],
            moreInformationLabel: text.more_information.label,
            moreInformationLink: text.more_information.link,
          }}
        />
      </Box>
    </Box>
  );
}

const MetadataBox = styled(Box)(
  css({
    flex: asResponsiveArray({ md: '1 1 auto', lg: '1 1 40%' }),
  })
);

type DecoratedLinkViewProps = {
  link: DecoratedLink;
  compact: boolean;
};

const DecoratedLinkView = (props: DecoratedLinkViewProps) => {
  const { link, compact } = props;
  return compact ? (
    <CompactDecoratedLink title={link.title} href={link.href} />
  ) : (
    <ExpandedDecoratedLink link={link} />
  );
};

const CompactDecoratedLink = ({
  title,
  href,
}: {
  title: string;
  href: string;
}) => {
  return (
    <Box borderBottom="1px solid black" height="5rem">
      <Link href={href}>
        <Box as="a" display="flex">
          <Text>{title}</Text>
          <ExternalLinkIcon />
        </Box>
      </Link>
    </Box>
  );
};

const ExpandedDecoratedLink = ({ link }: { link: DecoratedLink }) => {
  return (
    <Box borderBottom="1px solid black" height="5rem">
      {link.title}
    </Box>
  );
};

const LinksTile = styled.article<{
  height?: number | string;
  backgroundColor?: string;
}>((x) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: x.backgroundColor ? x.backgroundColor : 'white',
    p: 0,
    borderRadius: 1,
    boxShadow: 'tile',
    height: x.height,
  })
);
