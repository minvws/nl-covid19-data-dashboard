import { Box } from '../base';
import { Calendar, ChevronRight, Clock, Database, External as ExternalLinkIcon, MeerInformatie } from '@corona-dashboard/icons';
import { colors } from '@corona-dashboard/common';
import { ExternalLink } from '~/components/external-link';
import { Anchor, InlineText, Text } from '../typography';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';
import css from '@styled-system/css';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { insertDateIntoString } from '~/components/metadata/logic/insert-date-into-string';
import { Link } from '~/utils/link';
import { MetadataProps } from './types';

/**
 * @function
 * @name Metadata
 * @description A function component that generates a metadata interface based on the provided parameters. It handles
 *  multiple use cases, including tile footers, single or multiple data sources, different date formats, and intervals.
 *  It also provides an option for a disclaimer and more information label.
 * @param {MetadataProps} props - The properties object containing all necessary parameters for Metadata function.
 * @returns {JSX.Element} JSX Element that represents metadata information.
 */
export function Metadata({
  dataSources = [],
  date,
  dateOfInsertionUnix,
  datePeriod,
  datumsText,
  disclaimer,
  intervalCount,
  isArchivedGraph = false,
  isTileFooter,
  isPageInformationBlock,
  marginBottom,
  obtainedAt,
  source,
  dateOrRange,
  accessibilitySubject,
  moreInformationLabel,
  moreInformationLink,
  referenceLink,
  jsonSources = [],
}: MetadataProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const metadataText = commonTexts.common.metadata;

  const dateString =
    typeof date === 'number'
      ? replaceVariablesInText(commonTexts.common.metadata.date, {
          date: formatDateFromSeconds(date, 'axis-with-year'),
        })
      : typeof date === 'string'
      ? date
      : date && date.start && date.end
      ? replaceVariablesInText(commonTexts.common.metadata.date_from_to, {
          startDate: formatDateFromSeconds(date.start, 'weekday-long'),
          endDate: formatDateFromSeconds(date.end, 'weekday-long'),
        })
      : null;

  const intervalString =
    intervalCount &&
    replaceVariablesInText(commonTexts.common.metadata.interval, {
      count: intervalCount,
    });

  const dateText = datumsText && dateOfInsertionUnix && dateOrRange && insertDateIntoString(formatDateFromSeconds, datumsText, dateOfInsertionUnix, dateOrRange);

  return (
    <>
      {!isTileFooter && source && (
        <Text color="gray7" variant="label1">
          {`${dateString} - ${commonTexts.common.metadata.source}: `}
          <ExternalLink ariaLabel={source.ariaText} href={source.href}>
            {source.text}
            <ExternalLinkIcon width={space[3]} height={space[2]} />
          </ExternalLink>
        </Text>
      )}

      {isPageInformationBlock && (
        <Box spacing={2}>
          <Box display="flex" alignItems="flex-start" color="gray7">
            <Icon>
              <Clock aria-hidden color={colors.gray7} />
            </Icon>
            <Text variant="label1">{dateText}</Text>
          </Box>

          {dataSources.length > 0 && (
            <MetadataItem
              icon={<Database aria-hidden />}
              items={dataSources}
              label={referenceLink ? commonTexts.informatie_header.bron : metadataText.source}
              accessibilityText={commonTexts.accessibility.text_source}
              accessibilitySubject={accessibilitySubject}
              referenceLink={referenceLink}
            />
          )}

          {referenceLink && <MetadataReference icon={<MeerInformatie aria-hidden />} referenceLink={referenceLink} />}

          {jsonSources.length > 0 && <MetadataItem icon={<MeerInformatie aria-hidden />} items={jsonSources} label={metadataText.metrics_json_links.metrics_json_source} />}

          {moreInformationLabel && <MetadataItem icon={<MeerInformatie aria-hidden />} items={moreInformationLink ? [moreInformationLink] : []} label={moreInformationLabel} />}
        </Box>
      )}

      {isTileFooter && (
        /**
         * @TODO Clean up the negative margin by passing the Metadata instance
         * to the Tile via props and position it there properly.
         * @TODO split up the `isTileFooter` vs non `isTileFooter` implementations,
         * should be separate components.
         */
        <Box as="footer" marginTop={space[3]} marginBottom={marginBottom || { _: '0', sm: `-${space[3]}` }} gridArea="metadata">
          <Text color="gray7" variant="label1">
            {datumsText && Array.isArray(date) ? (
              replaceVariablesInText(datumsText, {
                weekStart: formatDateFromSeconds(date[0], 'weekday-long'),
                weekEnd: formatDateFromSeconds(date[1], 'weekday-long'),
              })
            ) : (
              <>
                {datePeriod && (
                  <Box display="flex" alignItems="flex-start" color="gray7">
                    <Icon>
                      <Calendar aria-hidden color={colors.gray7} />
                    </Icon>
                    <Text variant="label1">
                      {replaceVariablesInText(commonTexts.common.metadata.time_interval, {
                        dateStart: formatDateFromSeconds(datePeriod.start, 'weekday-long'),
                        dateEnd: formatDateFromSeconds(datePeriod.end, 'weekday-long'),
                      })}
                    </Text>
                  </Box>
                )}

                {dateOfInsertionUnix && (
                  <MetadataItem
                    icon={<Clock aria-hidden colors={colors.gray7} />}
                    items={[
                      {
                        text: insertDateIntoString(
                          formatDateFromSeconds,
                          isArchivedGraph ? commonTexts.common.metadata.last_insertion_date_archived : commonTexts.common.metadata.last_insertion_date,
                          dateOfInsertionUnix,
                          dateOfInsertionUnix,
                          'weekday-long'
                        ),
                      },
                    ]}
                  />
                )}

                {source ? (
                  <MetadataItem icon={<Database aria-hidden />} items={[source]} label={commonTexts.common.metadata.source} />
                ) : dataSources && dataSources.length > 0 ? (
                  <MetadataItem
                    icon={<Database aria-hidden color={colors.gray7} />}
                    items={dataSources}
                    label={referenceLink ? commonTexts.informatie_header.bron : metadataText.source}
                  />
                ) : null}

                {disclaimer && (
                  <Box paddingBottom={space[3]}>
                    <Markdown content={disclaimer}></Markdown>
                  </Box>
                )}
                {dateString}
                {obtainedAt &&
                  ` ${replaceVariablesInText(commonTexts.common.metadata.obtained, {
                    date: formatDateFromSeconds(obtainedAt, 'axis-with-year'),
                  })}`}
                {intervalString && `. ${intervalString}`}
              </>
            )}
          </Text>
        </Box>
      )}
    </>
  );
}

interface MetadataItemProps {
  icon: JSX.Element;
  items: {
    text: string;
    href?: string;
  }[];
  label?: string;
  accessibilityText?: string;
  accessibilitySubject?: string;
  referenceLink?: string;
}

function MetadataItem({ icon, label, items, referenceLink, accessibilityText, accessibilitySubject }: MetadataItemProps) {
  return (
    <Box display="flex" alignItems="flex-start" color={colors.gray7}>
      <Icon>{icon}</Icon>

      <Text variant="label1">
        {items && referenceLink && (
          <>
            {label && `${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.text}>
                <InlineText>
                  {index > 0 && (index !== items.length - 1 ? ' , ' : ' & ')}
                  {item.text}
                </InlineText>
              </Fragment>
            ))}
          </>
        )}
        {items && !referenceLink && (
          <>
            {label && `${label}: `}
            {items.map((item, index) => (
              <Fragment key={index + item.text}>
                {index > 0 && ', '}
                {item.href && (
                  <ExternalLink
                    href={item.href}
                    underline="hover"
                    ariaLabel={
                      accessibilityText && accessibilitySubject
                        ? replaceVariablesInText(accessibilityText, {
                            subject: accessibilitySubject,
                            source: item.text,
                          })
                        : undefined
                    }
                  >
                    {item.text}
                    <ExternalLinkIcon width={space[3]} height={space[2]} />
                  </ExternalLink>
                )}
                {!item.href && item.text}
              </Fragment>
            ))}
          </>
        )}
      </Text>
    </Box>
  );
}

interface metadataReferenceProps {
  icon: React.ReactNode;
  referenceLink: string;
}

function MetadataReference({ icon, referenceLink }: metadataReferenceProps) {
  const { commonTexts } = useIntl();

  const words = commonTexts.informatie_header.meer_informatie_link.split(' ');

  return (
    <Box display="flex" alignItems="flex-start" color="gray7">
      <Icon>{icon}</Icon>

      <Link href={referenceLink} passHref>
        <Anchor underline="hover" variant="label1">
          {words.map((word, index) => (
            <Fragment key={index}>
              {words.length - 1 === index ? (
                <span
                  css={css({
                    display: 'inline-block',
                    textDecoration: 'inherit',
                  })}
                >
                  {word}&nbsp;
                  <ChevronRight width="10px" height="10px" />
                </span>
              ) : (
                <span>{`${word} `}</span>
              )}
            </Fragment>
          ))}
        </Anchor>
      </Link>
    </Box>
  );
}

const Icon = styled.span(() =>
  css({
    minWidth: '1.8rem',

    svg: {
      height: '15px',
      width: 'auto',
    },
  })
);
